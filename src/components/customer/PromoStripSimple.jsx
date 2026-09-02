'use client';

import { useState } from 'react';
import { X, Copy, Check, Tag } from 'lucide-react';

export default function PromoStripSimple() {
  const [isVisible, setIsVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText('FLAT20');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isVisible) return null;

  return (
    <div className="relative bg-[#dce9d8] text-[#223d1b] py-2 px-4 text-xs font-semibold tracking-wide border-b border-[#c8debf]/80 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        {/* Left spacer for symmetry on desktop */}
        <div className="hidden lg:block w-8" />

        {/* Center Announcement Text */}
        <div className="flex-1 flex items-center justify-center gap-2 text-center text-[11px] sm:text-xs">
          <span>NEW LAUNCH: Pure Ayurvedic & Glow Essentials • Use code</span>
          <button
            onClick={copyCode}
            title="Click to copy FLAT20"
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/80 hover:bg-white text-[#223d1b] font-bold border border-[#b9d3ad] shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <Tag className="w-2.5 h-2.5 text-[#2d4e24]" />
            <span>FLAT20</span>
            {copied ? (
              <Check className="w-3 h-3 text-emerald-600 animate-in fade-in" />
            ) : (
              <Copy className="w-2.5 h-2.5 text-gray-500" />
            )}
          </button>
          <span>for 20% OFF 🤍</span>
        </div>

        {/* Right close button */}
        <button
          onClick={() => setIsVisible(false)}
          aria-label="Dismiss banner"
          className="p-1 rounded-full text-[#385b2e]/80 hover:text-[#223d1b] hover:bg-black/5 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

