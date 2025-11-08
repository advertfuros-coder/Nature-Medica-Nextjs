'use client';

import { useState } from 'react';
import { X, Copy, Check, Tag } from 'lucide-react';

export default function PromoStripSimple() {
  const [isVisible, setIsVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText('NEW20');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-[#415f2d] to-[#5a8240] text-white py-2 px-4 relative">
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-3 text-center">
        <Tag className="w-4 h-4 flex-shrink-0" />
        <p className="text-[11px] sm:text-[12px] font-medium">
          Use code{' '}
          <button
            onClick={copyCode}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded hover:bg-white/30 transition-colors mx-1"
          >
            <span className="font-bold">NEW20</span>
            {copied ? (
              <Check className="w-3 h-3" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
          {' '}for 20% discount on your first order!
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
