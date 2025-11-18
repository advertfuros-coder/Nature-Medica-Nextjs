'use client';

import Image from 'next/image';
import { Check } from 'lucide-react';

export default function TrustedByBanner() {
  const features = [
    'Research-backed products',
    'Assured safety',
    'Authenticity guaranteed',
  ];

  return (
    <section className="bg-gradient-to-r from-[#3C5D27]/5 to-white py-6 border-y border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Image */}
          <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
            <img
              src="https://img4.hkrtcdn.com/35085/bnr_3508403_o.jpg"
              alt="Trusted customers"
              className="object-cover w-full h-full"
            />
          </div>

          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-3">
              <h2 className="text-base font-bold text-gray-900 mb-1">
                Trusted by 50K+ Consumers
              </h2>
              <p className="text-[10px] text-gray-500">
                Join millions who rely on our quality products
              </p>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-x-4 gap-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-[#3C5D27] rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-[11px] text-gray-700 font-medium">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4 lg:gap-6 flex-shrink-0">
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">50K+</p>
              <p className="text-[9px] text-gray-500">Customers</p>
            </div>
            <div className="w-px bg-gray-300" />
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">4.9★</p>
              <p className="text-[9px] text-gray-500">Rating</p>
            </div>
            <div className="w-px bg-gray-300" />
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">100%</p>
              <p className="text-[9px] text-gray-500">Authentic</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
