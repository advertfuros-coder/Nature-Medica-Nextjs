"use client";

import { useState, useEffect } from "react";
import popupbanner from "@/assets/popupbanner.jpeg";
import Image from "next/image";
export default function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);

  useEffect(() => {
    // Show popup only if not submitted before
    const submitted = localStorage.getItem("newsletterSubmitted");
    if (!submitted) {
      const timer = setTimeout(() => setOpen(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });

      if (response.ok) {
        localStorage.setItem("newsletterSubmitted", "true"); // Mark submitted
        setName("");
        setPhone("");
        setOpen(false);

        setTimeout(() => {
          setShowCoupon(true);
          setTimeout(() => setShowCoupon(false), 6000);
        }, 300);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Error submitting form.");
    } finally {
      setLoading(false);
    }
  };

  if (!open && !showCoupon) return null;

  return (
    <>
      {/* Newsletter Popup */}
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col md:flex-row border border-gray-200 animate-scaleIn max-h-[90vh] md:max-h-auto">
            {/* Left Image */}
            <div className="relative w-full md:w-1/2 h-48 md:h-auto">
              <Image
                src={popupbanner}
                alt="Popup Image"
                className="object-cover w-full h-full"
              />
            </div>

            {/* Right Content */}
            <div className="p-6 md:p-12 w-full md:w-1/2 flex flex-col justify-center relative bg-gradient-to-br from-white to-gray-50 overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-400 hover:text-gray-600 transition-colors hover:rotate-90 duration-300 z-10"
                aria-label="Close popup"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h2 className="text-base md:text-lg font-semibold text-gray-900 leading-snug tracking-tight">
                Rediscover Your Natural Wellness Journey
              </h2>

              <p className="text-gray-600 mt-2 text-[10px] leading-relaxed">
                Join our community and enjoy 10% off your first order along with exclusive member-only offers.
              </p>

              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="border border-gray-300 w-full mt-3 md:mt-5 rounded-lg px-4 py-2.5 md:py-3 text-sm focus:ring-2 focus:ring-green-700 outline-none shadow-sm bg-white/80 backdrop-blur"
                />

                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="border border-gray-300 w-full mt-3 md:mt-5 rounded-lg px-4 py-2.5 md:py-3 text-sm focus:ring-2 focus:ring-green-700 outline-none shadow-sm bg-white/80 backdrop-blur"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-3 md:mt-5 bg-[#2d4a22] text-white py-2.5 md:py-3 rounded-lg font-semibold text-sm hover:bg-[#1f3517] transition-all shadow-md w-full disabled:opacity-50"
                >
                  {loading ? "SUBMITTING..." : "UNLOCK 10% OFF"}
                </button>
              </form>

              <button
                onClick={() => setOpen(false)}
                className="mt-3 md:mt-4 text-gray-500 text-xs md:text-[14px] hover:text-gray-700 transition-colors"
              >
                No thanks, maybe later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Premium Coupon Code Message - Centered with Black Backdrop */}
      {showCoupon && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-backdropFadeIn"
          onClick={() => setShowCoupon(false)}
        >
          <div
            className="relative animate-zoomIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl max-w-md w-full">
              {/* Animated Gradient Background */}
              <div className="absolute inset-0 bg-gradient-animated"></div>

              {/* Shimmer Effect */}
              <div className="absolute inset-0 shimmer-effect"></div>

              {/* Content */}
              <div className="relative px-8 py-6 backdrop-blur-sm">
                <button
                  onClick={() => setShowCoupon(false)}
                  className="absolute top-3 right-3 text-white/90 hover:text-white text-xl font-light transition-all hover:rotate-90 duration-300"
                >
                  ×
                </button>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="text-xl animate-bounce-gentle">🎉</div>
                    <div className="absolute inset-0 text-xl animate-pulse-glow">✨</div>
                  </div>

                  <div className="flex-1">
                    <p className="text-white/90 text-[10px] font-medium tracking-wide uppercase">
                      🎊 Congratulations!
                    </p>
                    <div className="mt-1 bg-white/20 backdrop-blur-md rounded-lg px-4 py-3 border border-white/30">
                      <p className="text-[10px] text-white/80 font-medium mb-1">Your Exclusive Code:</p>
                      <p className="text-xl font-black text-white tracking-widest animate-pulse-text">
                        NATURE10
                      </p>
                    </div>
                    <p className="text-[10px] text-white/75 mt-2 font-medium animate-fadeInDelay">
                      🌿 Get 10% OFF on your first order!
                    </p>
                  </div>
                </div>

                <div className="mt-4 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full animate-progress"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes backdropFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes zoomIn {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(200%) rotate(45deg);
          }
        }
        
        @keyframes bounceGentle {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-8px) scale(1.1);
          }
        }
        
        @keyframes pulseGlow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.2);
          }
        }
        
        @keyframes pulseText {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        
        @keyframes fadeInDelay {
          0% {
            opacity: 0;
            transform: translateY(5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        
        .animate-backdropFadeIn {
          animation: backdropFadeIn 0.3s ease-out;
        }
        
        .animate-zoomIn {
          animation: zoomIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .bg-gradient-animated {
          background: linear-gradient(
            135deg,
            #2d4a22,
            #d4af37,
            #1f3517,
            #f4c430,
            #2d4a22
          );
          background-size: 400% 400%;
          animation: gradientShift 4s ease infinite;
        }
        
        .shimmer-effect {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          width: 50%;
          animation: shimmer 3s infinite;
        }
        
        .animate-bounce-gentle {
          animation: bounceGentle 2s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulseGlow 2s ease-in-out infinite;
        }
        
        .animate-pulse-text {
          animation: pulseText 1.5s ease-in-out infinite;
        }
        
        .animate-progress {
          animation: progress 6s linear;
        }
        
        .animate-fadeInDelay {
          animation: fadeInDelay 0.6s ease-out 0.3s both;
        }
      `}</style>
    </>
  );
}
