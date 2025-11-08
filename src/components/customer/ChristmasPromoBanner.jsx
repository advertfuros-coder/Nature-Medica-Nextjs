'use client';

import React from 'react';

export default function ChristmasPromoBanner() {
  return (
    <section className="relative w-full bg-gradient-to-br from-[#2d4f3a] via-[#2a483a] to-[#385c45] text-white overflow-hidden rounded-2xl">
      <div className="relative px-8 md:px-12 py-12 md:py-16 ">
        
        {/* Text Section - Top Left with Black Gradient Overlay */}
        <div className="relative max-w-sm text-left z-20">
          {/* Black gradient behind text */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent -ml-8 -mt-12 w-[150%] h-[200%] rounded-r-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-normal leading-tight mb-3">
              Tis the Season to shop early
            </h2>
            <p className="text-sm md:text-base text-white/95 font-light leading-relaxed">
              Beat the rush & wrap up wellness<br />this Christmas
            </p>
          </div>
        </div>

        {/* Image Section - Center Right (No Rotation) */}
        <div className="absolute top-1/2 scale-120 right-8 md:right-16 -translate-y-1/2 z-10">
          <img
            src="https://dam.hollandandbarrettimages.co.uk/uk_ie/fy26_q1_ukie_mob_homepage_bentobox_carousel_christmassale_2.webp"
            alt="Christmas wellness products"
            className="object-contain max-h-[220px] md:max-h-[280px] w-auto"
          />
        </div>
      </div>

      {/* Floating Sparkle Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large orange sparkles */}
        <div className="absolute top-[20%] left-[35%] w-3 h-3 bg-orange-400 rounded-full blur-[1px] opacity-80 animate-float-1"></div>
        <div className="absolute top-[35%] left-[28%] w-2.5 h-2.5 bg-orange-500 rounded-full blur-[1px] opacity-70 animate-float-2"></div>
        <div className="absolute bottom-[38%] left-[32%] w-2 h-2 bg-orange-400 rounded-full blur-[0.5px] opacity-60 animate-float-3"></div>
        
        {/* Medium yellow sparkles */}
        <div className="absolute top-[15%] left-[42%] w-2 h-2 bg-yellow-400 rounded-full blur-[0.5px] opacity-75 animate-float-4"></div>
        <div className="absolute top-[45%] left-[25%] w-2 h-2 bg-yellow-300 rounded-full opacity-70 animate-float-1"></div>
        <div className="absolute bottom-[32%] left-[30%] w-1.5 h-1.5 bg-yellow-400 rounded-full opacity-80 animate-float-2"></div>
        
        {/* Right side sparkles */}
        <div className="absolute top-[28%] right-[35%] w-2.5 h-2.5 bg-orange-400 rounded-full blur-[1px] opacity-70 animate-float-3"></div>
        <div className="absolute top-[18%] right-[30%] w-2 h-2 bg-yellow-400 rounded-full opacity-75 animate-float-4"></div>
        <div className="absolute top-[40%] right-[38%] w-2 h-2 bg-orange-500 rounded-full blur-[0.5px] opacity-65 animate-float-1"></div>
        <div className="absolute bottom-[35%] right-[28%] w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-70 animate-float-2"></div>
        <div className="absolute bottom-[28%] right-[36%] w-2 h-2 bg-orange-400 rounded-full blur-[0.5px] opacity-60 animate-float-3"></div>
        
        {/* Small accent sparkles */}
        <div className="absolute top-[32%] left-[48%] w-1 h-1 bg-yellow-200 rounded-full opacity-60 animate-float-4"></div>
        <div className="absolute bottom-[45%] left-[38%] w-1 h-1 bg-orange-300 rounded-full opacity-50 animate-float-1"></div>
        <div className="absolute top-[52%] right-[42%] w-1 h-1 bg-yellow-300 rounded-full opacity-60 animate-float-2"></div>
        
        {/* Green undertone sparkles */}
        <div className="absolute top-[42%] left-[34%] w-1.5 h-1.5 bg-green-400 rounded-full blur-[1px] opacity-40 animate-float-3"></div>
        <div className="absolute bottom-[42%] right-[40%] w-1.5 h-1.5 bg-green-300 rounded-full blur-[1px] opacity-35 animate-float-4"></div>
      </div>
    </section>
  );
}
