'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const merchantOrderId = searchParams.get('merchantOrderId');
    
    if (!merchantOrderId) {
      setStatus('failed');
      setError('Order ID not found');
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch(`/api/payments/phonepe/status?merchantOrderId=${merchantOrderId}`);
        const data = await res.json();

        if (data.success) {
          const paymentState = data.status.state;

          if (paymentState === 'COMPLETED') {
            setStatus('success');
            setOrderDetails({
              orderId: merchantOrderId,
              amount: data.status.amount / 100,
              transactionId: data.status.transactionId,
              paymentMethod: data.status.paymentInstrument?.type
            });
          } else if (paymentState === 'PENDING') {
            setStatus('pending');
            setOrderDetails({ orderId: merchantOrderId });
          } else {
            setStatus('failed');
            setError('Payment was not successful');
          }
        } else {
          setStatus('failed');
          setError(data.error || 'Failed to verify payment');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('failed');
        setError('Failed to verify payment status');
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-[#415f2d] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verifying payment...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait, do not close this page</p>
        </div>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <AlertCircle className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Payment Pending</h1>
          <p className="text-gray-600 mb-6">
            Your payment is being processed. We'll notify you once it's confirmed.
          </p>
          {orderDetails?.orderId && (
            <p className="text-sm text-gray-500 mb-6">
              Order ID: <span className="font-semibold">{orderDetails.orderId}</span>
            </p>
          )}
          <div className="space-y-3">
            <Link
              href="/orders"
              className="block w-full bg-[#415f2d] text-white py-3 rounded-lg hover:bg-[#344b24] transition-colors font-semibold"
            >
              View Orders
            </Link>
            <Link
              href="/"
              className="block w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Payment Failed</h1>
          <p className="text-gray-600 mb-2">
            {error || 'Your payment was not successful.'}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Please try again or contact support if the issue persists.
          </p>
          <div className="space-y-3">
            <Link
              href="/cart"
              className="block w-full bg-[#415f2d] text-white py-3 rounded-lg hover:bg-[#344b24] transition-colors font-semibold"
            >
              Return to Cart
            </Link>
            <Link
              href="/"
              className="block w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Payment Successful!</h1>
        <p className="text-gray-600 mb-2">
          Your order has been placed successfully.
        </p>
        {orderDetails && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 mt-4">
            <div className="text-sm space-y-2">
              <p className="text-gray-600">
                Order ID: <span className="font-semibold text-gray-900">{orderDetails.orderId}</span>
              </p>
              <p className="text-gray-600">
                Amount: <span className="font-semibold text-gray-900">₹{orderDetails.amount?.toLocaleString('en-IN')}</span>
              </p>
              {orderDetails.transactionId && (
                <p className="text-gray-600">
                  Transaction ID: <span className="font-semibold text-gray-900 text-xs">{orderDetails.transactionId}</span>
                </p>
              )}
              {orderDetails.paymentMethod && (
                <p className="text-gray-600">
                  Payment Method: <span className="font-semibold text-gray-900">{orderDetails.paymentMethod}</span>
                </p>
              )}
            </div>
          </div>
        )}
        <div className="space-y-3">
          <Link
            href="/orders"
            className="block w-full bg-[#415f2d] text-white py-3 rounded-lg hover:bg-[#344b24] transition-colors font-semibold"
          >
            View Order Details
          </Link>
          <Link
            href="/"
            className="block w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
