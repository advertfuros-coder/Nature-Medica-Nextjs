'use client';

import Image from 'next/image';
import p1 from '@/assets/1.png';
import p2 from '@/assets/2.png';
import p3 from '@/assets/3.png';
import p4 from '@/assets/4.png';

const stats = [
  {
    image: p1,
    value: '51 Million+',
    label: 'Registered users as of Aug 18, 2025',
    bgColor: 'bg-yellow-50',
    accentColor: 'from-yellow-500 to-orange-500'
  },
  {
    image: p2,
    value: '71 Million+',
    label: 'Orders on NatureMedica till date',
    bgColor: 'bg-green-50',
    accentColor: 'from-[#415f2d] to-green-600'
  },
  {
    image: p3,
    value: '60000+',
    label: 'Unique items sold last 6 months',
    bgColor: 'bg-teal-50',
    accentColor: 'from-teal-500 to-cyan-500'
  },
  {
    image: p4,
    value: '19000+',
    label: 'Pin codes serviced last 3 months',
    bgColor: 'bg-red-50',
    accentColor: 'from-red-500 to-pink-500'
  }
];

export default function WhyChooseUs() {
  return (
    <section className="bg-gradient-to-b from-white via-gray-50 to-white py-6 lg:py-10">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-block px-2.5 py-0.5 bg-[#415f2d] bg-opacity-10 text-[#ffffff] rounded-full text-xs font-medium mb-4">
            Trusted Nationwide
          </div>
          <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 tracking-tight mb-4">
            Why Choose NatureMedica
          </h2>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto leading-relaxed">
            We're trusted by millions of users for reliable medicine delivery and wellness essentials, straight to your doorstep
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="group relative bg-white rounded-lg p-3.5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#415f2d] hover:border-opacity-20"
            >
              {/* Decorative Background Element */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bgColor} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
              
              <div className="relative flex flex-col items-center text-center">
                {/* Image Container */}
                <div className={`w-14 h-14 lg:w-16 lg:h-16 flex items-center justify-center mb-6 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                  {stat.image ? (
                    <Image 
                      src={stat.image} 
                      alt={stat.label}
                      width={64}
                      height={64}
                      className="object-contain w-10 h-10 lg:w-12 lg:h-12"
                    />
                  ) : (
                    <div className="text-4xl">🎯</div>
                  )}
                </div>

                {/* Value with Gradient */}
                <h3 className={`text-xl lg:text-2xl font-bold bg-gradient-to-r ${stat.accentColor} bg-clip-text text-transparent `}>
                  {stat.value}
                </h3>

                {/* Label */}
                <p className="text-[10px] lg:text-xs text-gray-600 leading-relaxed">
                  {stat.label}
                </p>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#415f2d] to-transparent opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        {/* <div className="text-center mt-12 lg:mt-16">
          <p className="text-gray-600 mb-6">
            Join millions who trust us for their health and wellness needs
          </p>
          <a 
            href="/about"
            className="inline-flex items-center gap-2 text-[#415f2d] hover:text-[#344b24] font-semibold transition-colors group"
          >
            Learn more about us
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div> */}
      </div>
    </section>
  );
}
