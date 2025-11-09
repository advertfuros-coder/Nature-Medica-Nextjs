"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { ConfettiButton } from "@/components/ui/confetti";

const page = () => {
  const confettiRef = useRef(null);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (confettiRef.current) {
      let count = 0;
      const interval = setInterval(() => {
        confettiRef.current.click();
        count++;
        if (count >= 4) {
          clearInterval(interval);
          setShowMessage(true);
        }
      }, 400); // slightly faster icntervals for livelier effect
    }
  }, []);

  return (
    <div className="min-h-sc reen pt-24 pb-24 flex flex-col items-center justify-center text-center space-y-8 bg-gradient-to-b from-white to-green-50">
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
      {showMessage ? (
        <p className="text-lg max-w-xl text-gray-700 animate-fadeIn">
          We appreciate your order and hope our wellness products bring you great health and happiness!
        </p>
      ) : (
        <p className="text-lg max-w-xl text-gray-500 italic opacity-70">Celebrating your purchase...</p>
      )}

      <ConfettiButton
        ref={confettiRef}
        className="mt-2 rounded-md bg-[#415f2d] px-8 py-4 text-white font-semibold hover:bg-[#344b24] transition-transform transform hover:scale-105 active:scale-95 shadow-lg shadow-green-400/50"
        aria-label="Celebrate Your Order"
      >
        Celebrate!
      </ConfettiButton>
    </div>
  );
};

export default page;
