'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { clearCart } from '@/store/slices/cartSlice';

export default function PaymentProcessing() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    const verifyPayment = async () => {
      const txnId = searchParams.get('txnId');
      const pendingData = sessionStorage.getItem('pendingOrderData');

      if (!txnId || !pendingData) {
        router.push('/payment-failed');
        return;
      }

      const { orderData, merchantTransactionId } = JSON.parse(pendingData);

      try {
        const res = await fetch('/api/phonepe/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ merchantTransactionId, orderData })
        });

        const data = await res.json();

        if (res.ok) {
          sessionStorage.removeItem('pendingOrderData');
          dispatch(clearCart());
          setStatus('success');
          setTimeout(() => {
            router.push(`/order-success?orderId=${data.orderId}`);
          }, 2000);
        } else {
          setStatus('failed');
          setTimeout(() => {
            router.push('/payment-failed');
          }, 2000);
        }
      } catch (error) {
        setStatus('failed');
        setTimeout(() => {
          router.push('/payment-failed');
        }, 2000);
      }
    };

    verifyPayment();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {status === 'verifying' && (
          <>
            <div className="w-16 h-16 border-4 border-[#415f2d] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900">Verifying Payment</h2>
            <p className="text-sm text-gray-600 mt-2">Please wait...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Payment Successful!</h2>
            <p className="text-sm text-gray-600 mt-2">Redirecting...</p>
          </>
        )}
        {status === 'failed' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Payment Failed</h2>
            <p className="text-sm text-gray-600 mt-2">Redirecting...</p>
          </>
        )}
      </div>
    </div>
  );
}
