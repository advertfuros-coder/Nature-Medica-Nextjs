'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function PaymentStatusPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get('order_id');

    const [status, setStatus] = useState('verifying'); // verifying, success, failed
    const [message, setMessage] = useState('Verifying your payment...');

    useEffect(() => {
        if (!orderId) {
            setStatus('failed');
            setMessage('Invalid order ID');
            return;
        }

        const verifyPayment = async () => {
            try {
                const res = await fetch('/api/cashfree/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orderId })
                });

                const data = await res.json();

                if (data.success && data.status === 'SUCCESS') {
                    setStatus('success');
                    setMessage('Payment successful! Redirecting...');
                    setTimeout(() => {
                        router.push('/thankyou');
                    }, 2000);
                } else {
                    setStatus('failed');
                    setMessage('Payment failed or pending. Please try again.');
                }
            } catch (error) {
                console.error('Verification error:', error);
                setStatus('failed');
                setMessage('Failed to verify payment. Please contact support.');
            }
        };

        verifyPayment();
    }, [orderId, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                {status === 'verifying' && (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-16 h-16 text-[#415f2d] animate-spin" />
                        <h2 className="text-xl font-semibold text-gray-900">Verifying Payment</h2>
                        <p className="text-gray-600">{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center gap-4">
                        <CheckCircle className="w-16 h-16 text-green-500" />
                        <h2 className="text-xl font-semibold text-gray-900">Payment Successful</h2>
                        <p className="text-gray-600">Your order has been confirmed.</p>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="flex flex-col items-center gap-4">
                        <XCircle className="w-16 h-16 text-red-500" />
                        <h2 className="text-xl font-semibold text-gray-900">Payment Failed</h2>
                        <p className="text-gray-600">{message}</p>
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
