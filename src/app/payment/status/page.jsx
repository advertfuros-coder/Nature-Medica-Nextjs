'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { clearCart } from '@/store/slices/cartSlice';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function PaymentStatusPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const cashfreeOrderId = searchParams.get('order_id'); // Unique Cashfree ID with timestamp
    let internalOrderId = searchParams.get('internal_order_id'); // Our NM000xxx ID

    // If internal_order_id is missing, extract it from cashfreeOrderId
    // Format: NM000085_1764660705883 -> NM000085
    if (!internalOrderId && cashfreeOrderId) {
        const parts = cashfreeOrderId.split('_');
        if (parts.length >= 2 && parts[0].startsWith('NM')) {
            internalOrderId = parts[0];
            console.log(`🔧 Extracted internal order ID: ${internalOrderId} from ${cashfreeOrderId}`);
        }
    }

    const [status, setStatus] = useState('verifying'); // verifying, success, failed
    const [message, setMessage] = useState('Verifying your payment...');
    const [createdOrderId, setCreatedOrderId] = useState(null);

    useEffect(() => {
        if (!cashfreeOrderId) {
            setStatus('failed');
            setMessage('Invalid payment session. Please contact support.');
            return;
        }

        if (!internalOrderId) {
            setStatus('failed');
            setMessage('Could not identify order. Please contact support with this payment ID: ' + cashfreeOrderId);
            return;
        }

        const verifyPaymentAndCreateOrder = async () => {
            try {
                // Step 1: Verify payment with Cashfree
                setMessage('Verifying payment with Cashfree...');
                const verifyRes = await fetch('/api/cashfree/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orderId: cashfreeOrderId })
                });

                const verifyData = await verifyRes.json();

                if (!verifyData.success || verifyData.status !== 'SUCCESS') {
                    setStatus('failed');
                    setMessage('Payment verification failed. Please contact support if amount was deducted.');
                    // Clean up sessionStorage
                    sessionStorage.removeItem('pendingOrderData');
                    sessionStorage.removeItem('cashfreeOrderId');
                    sessionStorage.removeItem('preGeneratedOrderId');
                    return;
                }

                // Step 2: Payment successful! Now create the order in database
                setMessage('Payment verified! Creating your order...');

                // Retrieve pending order data from sessionStorage
                const pendingOrderData = sessionStorage.getItem('pendingOrderData');

                if (!pendingOrderData) {
                    setStatus('failed');
                    setMessage('Order data not found. Please contact support - your payment was successful.');
                    return;
                }

                const orderPayload = JSON.parse(pendingOrderData);

                // Create the order in database with the internal order ID
                const createOrderRes = await fetch('/api/orders/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...orderPayload,
                        // Use the internal order ID from URL
                        preGeneratedOrderId: internalOrderId,
                        // Add payment verification info
                        cashfreeOrderId: cashfreeOrderId,
                        cashfreePaymentId: verifyData.payment?.cf_payment_id,
                        paymentVerified: true,
                    })
                });

                const createOrderData = await createOrderRes.json();

                if (!createOrderRes.ok) {
                    // Check if it's a duplicate key error (order already exists)
                    if (createOrderData.error && createOrderData.error.includes('duplicate key')) {
                        console.log('⚠️ Order already exists, updating payment status instead');
                        // Order already exists, just update payment status
                        await fetch('/api/orders/update-payment-status', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                orderId: internalOrderId,
                                paymentStatus: 'paid',
                                cashfreePaymentId: verifyData.payment?.cf_payment_id,
                                cashfreeOrderId: cashfreeOrderId
                            })
                        });

                        // Success!
                        setStatus('success');
                        setMessage('Payment successful! Your order has been placed.');
                        setCreatedOrderId(internalOrderId);

                        // Clear cart and sessionStorage
                        dispatch(clearCart());
                        sessionStorage.removeItem('pendingOrderData');
                        sessionStorage.removeItem('cashfreeOrderId');
                        sessionStorage.removeItem('preGeneratedOrderId');

                        // Redirect to thank you page
                        setTimeout(() => {
                            router.push(`/thankyou?orderId=${internalOrderId}`);
                        }, 2000);
                        return;
                    }

                    setStatus('failed');
                    setMessage(`Failed to create order: ${createOrderData.error}. Your payment was successful. Please contact support with this payment ID: ${cashfreeOrderId}`);
                    return;
                }

                // Step 3: Update the order payment status to "paid"
                await fetch('/api/orders/update-payment-status', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        orderId: createOrderData.orderId,
                        paymentStatus: 'paid',
                        cashfreePaymentId: verifyData.payment?.cf_payment_id,
                        cashfreeOrderId: cashfreeOrderId
                    })
                });

                // Success!
                setStatus('success');
                setMessage('Payment successful! Your order has been placed.');
                setCreatedOrderId(createOrderData.orderId);

                // Clear cart and sessionStorage
                dispatch(clearCart());
                sessionStorage.removeItem('pendingOrderData');
                sessionStorage.removeItem('cashfreeOrderId');
                sessionStorage.removeItem('preGeneratedOrderId');

                // Redirect to thank you page
                setTimeout(() => {
                    router.push(`/thankyou?orderId=${createOrderData.orderId}`);
                }, 2000);

            } catch (error) {
                console.error('Payment verification error:', error);
                setStatus('failed');
                setMessage('An error occurred while processing your payment. Please contact support.');
            }
        };

        verifyPaymentAndCreateOrder();
    }, [cashfreeOrderId, router, dispatch]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                {status === 'verifying' && (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-16 h-16 text-[#415f2d] animate-spin" />
                        <h2 className="text-xl font-semibold text-gray-900">Processing Payment</h2>
                        <p className="text-gray-600">{message}</p>
                        <p className="text-sm text-gray-500">Please do not refresh or close this page</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center gap-4">
                        <CheckCircle className="w-16 h-16 text-green-500" />
                        <h2 className="text-xl font-semibold text-gray-900">Payment Successful!</h2>
                        <p className="text-gray-600">Your order has been confirmed.</p>
                        {createdOrderId && (
                            <p className="text-sm text-gray-500">Order ID: <span className="font-mono font-semibold">{createdOrderId}</span></p>
                        )}
                        <p className="text-sm text-gray-500">Redirecting to confirmation page...</p>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="flex flex-col items-center gap-4">
                        <XCircle className="w-16 h-16 text-red-500" />
                        <h2 className="text-xl font-semibold text-gray-900">Payment Failed</h2>
                        <p className="text-gray-600 text-sm">{message}</p>
                        {cashfreeOrderId && (
                            <p className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                                Reference ID: {cashfreeOrderId}
                            </p>
                        )}
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => router.push('/checkout')}
                                className="px-6 py-2 bg-[#415f2d] text-white rounded-lg hover:bg-[#344b24] transition-colors"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => router.push('/contact')}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Contact Support
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
