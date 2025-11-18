import { useState, useEffect } from "react";
import Image from "next/image";

export default function NewsletterPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col md:flex-row border border-gray-200 animate-scaleIn">
        {/* Left Image */}
        <div className="relative w-full md:w-1/2 h-72 md:h-auto">
          <img
            src="https://plus.unsplash.com/premium_photo-1677502356487-023fca0fd6f0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjF8fGJlYXV0eSUyMHByb2R1Y3R8ZW58MHwwfDB8fHww"
            alt="Popup Image"
            fill
            className="object-cover"
          />
        </div>

        {/* Right Content */}
        <div className="p-8 md:p-12 w-full md:w-1/2 flex flex-col justify-center relative bg-gradient-to-br from-white to-gray-50">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
          >
            ×
          </button>

          <h2 className="text-2xl font-semibold text-gray-900 leading-snug tracking-tight">
            Rediscover Your Natural Wellness Journey
          </h2>

          <p className="text-gray-600 mt- text-sm md:text-base leading-relaxed">
            Join our community and enjoy 10% off your first order along with exclusive member-only offers.
          </p>

          <input
            type="text"
            placeholder="Enter your name"
            className="border border-gray-300 w-full mt-5 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-700 outline-none shadow-sm bg-white/80 backdrop-blur"
          />

          <input
            type="tel"
            placeholder="Enter your phone number"
            className="border border-gray-300 w-full mt-5 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-700 outline-none shadow-sm bg-white/80 backdrop-blur"
          />

          <button className="mt-5 bg-[#2d4a22] text-white py-3 rounded-lg font-semibold text-base hover:bg-[#1f3517] transition-all shadow-md">
            UNLOCK 10% OFF
          </button>

          <button
            onClick={() => setOpen(false)}
            className="mt-4 text-gray-500 text-sm hover:text-gray-700 transition-colors"
          >
            No thanks, maybe later
          </button>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
