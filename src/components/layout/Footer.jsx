'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  FiFacebook, 
  FiInstagram, 
  FiTwitter, 
  FiYoutube, 
  FiArrowRight, 
  FiCheck,
  FiMail,
  FiPhone
} from 'react-icons/fi';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubmitting(true);
    try {
      // Newsletter subscription logic
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }).catch(() => null);

      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 4000);
    } catch {
      setSubscribed(true);
    } finally {
      setSubmitting(false);
    }
  };

  const marqueeItems = [
    '100% Ayurvedic Botanical Actives',
    'AYUSH GMP Certified',
    'Free Express Shipping on Orders ₹499+',
    'Paraben & Sulfate Free',
    'Dermatologically Tested',
    'Cruelty Free & Vegan',
    'Non-Toxic Pure Formulations',
    'Authentic Cold-Pressed Extracts',
  ];

  return (
    <footer className="w-full bg-[#EBF3E8] text-gray-800 relative overflow-hidden font-sans border-t border-[#d8e8d4]">
      {/* 1. Top Dark Marquee Ticker Strip (matching reference) */}
      <div className="w-full bg-[#182a13] text-white py-2.5 overflow-hidden select-none border-b border-[#223d1b]">
        <div className="flex whitespace-nowrap animate-marquee">
          <div className="flex items-center gap-6 shrink-0 text-xs sm:text-[13px] font-semibold tracking-wide uppercase px-3">
            {marqueeItems.concat(marqueeItems).map((item, idx) => (
              <span key={idx} className="flex items-center gap-6">
                <span>{item}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#82c852] inline-block" />
              </span>
            ))}
          </div>
          <div className="flex items-center gap-6 shrink-0 text-xs sm:text-[13px] font-semibold tracking-wide uppercase px-3" aria-hidden="true">
            {marqueeItems.concat(marqueeItems).map((item, idx) => (
              <span key={`dup-${idx}`} className="flex items-center gap-6">
                <span>{item}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#82c852] inline-block" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 sm:pt-16 sm:pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Column 1: Social Media & Newsletter / VIP Club (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Circular Social Icons matching reference */}
            <div>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://www.facebook.com/profile.php?id=61584706168474"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-gray-400/80 bg-white/60 hover:bg-[#2d4e24] hover:text-white hover:border-[#2d4e24] flex items-center justify-center text-gray-800 transition-all duration-200 shadow-2xs"
                  aria-label="Facebook"
                >
                  <FiFacebook className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-gray-400/80 bg-white/60 hover:bg-[#2d4e24] hover:text-white hover:border-[#2d4e24] flex items-center justify-center text-gray-800 transition-all duration-200 shadow-2xs"
                  aria-label="X / Twitter"
                >
                  <FiTwitter className="w-4 h-4" />
                </a>
                <a
                  href="https://www.instagram.com/nature_medica_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-gray-400/80 bg-white/60 hover:bg-[#2d4e24] hover:text-white hover:border-[#2d4e24] flex items-center justify-center text-gray-800 transition-all duration-200 shadow-2xs"
                  aria-label="Instagram"
                >
                  <FiInstagram className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-gray-400/80 bg-white/60 hover:bg-[#2d4e24] hover:text-white hover:border-[#2d4e24] flex items-center justify-center text-gray-800 transition-all duration-200 shadow-2xs"
                  aria-label="YouTube"
                >
                  <FiYoutube className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Newsletter / Wellness Circle replacing App download */}
            <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border border-[#d8e8d4] shadow-2xs max-w-sm">
              <h3 className="text-xs sm:text-[13px] font-bold text-gray-900 uppercase tracking-wider mb-1">
                Join Nature Medica Circle
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-3">
                Subscribe to receive Ayurvedic wellness tips, exclusive launches & 10% off your first order.
              </p>

              {subscribed ? (
                <div className="flex items-center gap-2 p-2.5 bg-[#eef5ec] text-[#2d4e24] rounded-xl text-xs font-bold border border-[#2d4e24]/20">
                  <FiCheck className="w-4 h-4 text-[#2d4e24]" />
                  <span>Welcome to the Wellness Circle!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email address"
                    className="flex-1 bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#2d4e24]"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#2d4e24] hover:bg-[#223d1b] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center justify-center"
                    aria-label="Subscribe"
                  >
                    <FiArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                <span className="flex items-center gap-1">
                  <FiPhone className="w-3 h-3 text-[#2d4e24]" /> +91 8400043322
                </span>
                <span className="flex items-center gap-1">
                  <FiMail className="w-3 h-3 text-[#2d4e24]" /> Support 24/7
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: My Account (lg:col-span-2) */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-3.5 tracking-tight">
              My Account
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-[13px]">
              <li>
                <Link href="/profile" className="text-gray-700 hover:text-[#2d4e24] font-medium transition-colors">
                  My Profile
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-gray-700 hover:text-[#2d4e24] font-medium transition-colors">
                  My Orders
                </Link>
              </li>
              <li>
                <Link href="/addresses" className="text-gray-700 hover:text-[#2d4e24] font-medium transition-colors">
                  Manage Addresses
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-gray-700 hover:text-[#2d4e24] font-medium transition-colors">
                  Request Replacement / Returns
                </Link>
              </li>
              <li>
                <Link href="/track" className="text-gray-700 hover:text-[#2d4e24] font-medium transition-colors">
                  Track Shipment
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-gray-700 hover:text-[#2d4e24] font-medium transition-colors">
                  My Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: About (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-3.5 tracking-tight">
              About
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-[13px]">
              <li>
                <Link href="/about" className="text-gray-700 hover:text-[#2d4e24] font-medium transition-colors">
                  Why Nature Medica
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-700 hover:text-[#2d4e24] font-medium transition-colors">
                  Our Science
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-700 hover:text-[#2d4e24] font-medium transition-colors">
                  Ingredients
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-700 hover:text-[#2d4e24] font-medium transition-colors">
                  All Collections
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Information (lg:col-span-3) */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-3.5 tracking-tight">
              Information
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-[13px]">
              <li>
                <Link href="/contact" className="text-gray-700 hover:text-[#2d4e24] font-medium transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-700 hover:text-[#2d4e24] font-medium transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-700 hover:text-[#2d4e24] font-medium transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-gray-700 hover:text-[#2d4e24] font-medium transition-colors">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-700 hover:text-[#2d4e24] font-medium transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-700 hover:text-[#2d4e24] font-medium transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* 3. Giant Watermark / Brand Name (matching reference) */}
      <div className="w-full select-none pointer-events-none overflow-hidden text-center -my-2 sm:-my-4">
        <span className="text-[12vw] sm:text-[11vw] font-black tracking-tight text-[#2d4e24]/12 uppercase leading-none block font-sans">
          Nature Medica
        </span>
      </div>

      {/* 4. Bottom Copyright & Payment Methods Bar */}
      <div className="border-t border-[#d8e8d4] bg-[#E3EFE0]/70 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            {/* Copyright */}
            <p className="text-gray-600 text-center sm:text-left text-xs sm:text-[13px]">
              © {new Date().getFullYear()} <span className="font-semibold text-gray-900">Nature Medica</span>. All rights reserved.
            </p>

            {/* Payment Icons matching reference */}
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              <div className="bg-white px-2 py-1 rounded-md shadow-2xs border border-gray-200">
                <span className="font-black text-[#1A1F71] text-[11px] tracking-wider italic">VISA</span>
              </div>
              <div className="bg-white px-2 py-1 rounded-md shadow-2xs border border-gray-200 flex items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EB001B] inline-block -mr-1" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#F79E1B]/90 inline-block" />
              </div>
              <div className="bg-white px-2 py-1 rounded-md shadow-2xs border border-gray-200">
                <span className="font-bold text-[#006FCF] text-[10px] tracking-tighter">AMEX</span>
              </div>
              <div className="bg-white px-2 py-1 rounded-md shadow-2xs border border-gray-200">
                <span className="font-bold text-[#097939] text-[10px] tracking-tight">RuPay❯</span>
              </div>
              <div className="bg-white px-2 py-1 rounded-md shadow-2xs border border-gray-200">
                <span className="font-bold text-gray-800 text-[10px]">GPay</span>
              </div>
              <div className="bg-white px-2 py-1 rounded-md shadow-2xs border border-gray-200">
                <span className="font-bold text-[#00B9F5] text-[10px]">Paytm</span>
              </div>
              <div className="bg-white px-2 py-1 rounded-md shadow-2xs border border-gray-200">
                <span className="font-bold text-[#5F259F] text-[10px]">UPI</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </footer>
  );
}
