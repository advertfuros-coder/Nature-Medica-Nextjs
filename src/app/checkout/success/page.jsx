"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearCart } from "@/store/slices/cartSlice";
import { ConfettiButton } from "@/components/ui/confetti";
import Link from "next/link";

const OrderSuccessPage = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const confettiRef = useRef(null);
  const [showMessage, setShowMessage] = useState(false);
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    // Clear the cart when success page loads
    dispatch(clearCart());

    if (confettiRef.current) {
      let count = 0;
      const interval = setInterval(() => {
        confettiRef.current.click();
        count++;
        if (count >= 4) {
          clearInterval(interval);
          setShowMessage(true);
        }
      }, 400); // slightly faster intervals for livelier effect
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen pt-24 pb-24 flex flex-col items-center justify-center text-center space-y-8 bg-gradient-to-b from-white to-green-50">
      <Image
        src="/logo.png"
        alt="Nature Medica Logo"
        width={180}
        height={180}
        className="mb-4 drop-shadow-md animate-bounce"
        priority
      />
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
        Thank You for Shopping with{" "}
        <span className="text-[#415f2d] underline decoration-[#a3b18a]">Nature Medica!</span>
      </h1>

      {orderId && (
        <div className="bg-white border-2 border-green-200 rounded-xl p-6 shadow-lg max-w-md w-full mx-4">
          <p className="text-sm text-gray-600 mb-2">Your Order ID</p>
          <p className="text-2xl font-bold text-[#415f2d] font-mono">{orderId}</p>
          <p className="text-xs text-gray-500 mt-2">Please save this for your records</p>
        </div>
      )}

      {showMessage ? (
        <p className="text-lg max-w-xl text-gray-700 animate-fadeIn px-4">
          We appreciate your order and hope our wellness products bring you great health and happiness!
        </p>
      ) : (
        <p className="text-lg max-w-xl text-gray-500 italic opacity-70 px-4">Celebrating your purchase...</p>
      )}

      <ConfettiButton
        ref={confettiRef}
        className="mt-2 rounded-md bg-[#415f2d] px-8 py-4 text-white font-semibold hover:bg-[#344b24] transition-transform transform hover:scale-105 active:scale-95 shadow-lg shadow-green-400/50"
        aria-label="Celebrate Your Order"
      >
        Celebrate!
      </ConfettiButton>

      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Link
          href="/products"
          className="px-6 py-3 bg-white border-2 border-[#415f2d] text-[#415f2d] font-semibold rounded-lg hover:bg-green-50 transition-all shadow-md"
        >
          Continue Shopping
        </Link>
        <Link
          href="/my-orders"
          className="px-6 py-3 bg-[#415f2d] text-white font-semibold rounded-lg hover:bg-[#344b24] transition-all shadow-md"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
