'use client';

import Image from 'next/image';
import p1 from '@/assets/1.png';
import p2 from '@/assets/2.png';
import p3 from '@/assets/3.png';
import p4 from '@/assets/4.png';

const stats = [
  { image: p1, value: '51M+', label: 'Active Users', timeline: '2023-2025', color: 'bg-blue-50' },
  { image: p2, value: '71M+', label: 'Total Orders', timeline: 'Till Date', color: 'bg-green-50' },
  { image: p3, value: '60K+', label: 'Products', timeline: '6 Months', color: 'bg-purple-50' },
  { image: p4, value: '19K+', label: 'Pin Codes', timeline: '3 Months', color: 'bg-orange-50' },
];

export default function StatsCompactGrid() {
  return (
    <section className="py-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-5">
          <span className="inline-block px-2 py-0.5 bg-[#415f2d]/10 text-[#415f2d] rounded text-[9px] font-medium mb-1">
            OUR METRICS
          </span>
          <h2 className="text-base font-semibold text-gray-900">
            Growing Together
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`${stat.color} rounded-lg p-3 text-center border border-gray-200`}
            >
              <div className="flex justify-center mb-2">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Image
                    src={stat.image}
                    alt={stat.label}
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                </div>
              </div>
              <p className="text-lg font-bold text-gray-900 mb-0.5">{stat.value}</p>
              <p className="text-[10px] text-gray-600 mb-1">{stat.label}</p>
              <p className="text-[9px] text-gray-500">{stat.timeline}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
