'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Sparkles, ArrowUpRight } from 'lucide-react';

// Left Side Media (Larger Rectangle) - Video & Lifestyle visuals
const leftSlides = [
  {
    type: 'image',
    image: '/2027/ChatGPT Image Sep 2, 2026, 04_16_00 PM.png',
    badge: '100% Ayurvedic & Natural',
    title: 'Pure Herbal Formulations',
    subtitle: 'Crafted for daily radiance & deep nourishment',
    link: '/products',
  },
   
  {
    type: 'image',
    image: '/2027/ChatGPT Image Sep 2, 2026, 04_19_52 PM.png',
    badge: 'Clean & Toxin-Free',
    title: 'Glow That Speaks For Itself',
    subtitle: 'Gentle, potent, and restorative wellness',
    link: '/products',
  },
];

// Right Side Media (Smaller Rectangle) - Product & Face care spotlight
const rightSlides = [
  {
    image: '/2027/ChatGPT Image Sep 2, 2026, 04_34_31 PM.png',
    tagline: "products that work hard, so you don't have to",
    category: 'Face Care & Serums',
    link: '/products',
  },
  {
    image: '/2027/ChatGPT Image Sep 2, 2026, 04_45_56 PM.png',
    tagline: 'pure natural ingredients, real lasting glow',
    category: 'Daily Skincare Routine',
    link: '/products',
  },
  {
    image: '/2027/ChatGPT Image Sep 2, 2026, 04_28_34 PM.png',
    tagline: 'nourish your skin from deep within',
    category: 'Herbal Hydration',
    link: '/products?sort=bestseller',
  },
  {
    image: '/2027/ChatGPT Image Sep 2, 2026, 04_23_29 PM.png',
    tagline: 'experience authentic ayurvedic harmony',
    category: 'Wellness & Body',
    link: '/products',
  },
];

export default function HeroBanner({ banners }) {
  // Left Section State
  const [leftIndex, setLeftIndex] = useState(0);
  const [isLeftHovered, setIsLeftHovered] = useState(false);

  // Right Section State
  const [rightIndex, setRightIndex] = useState(0);
  const [isRightHovered, setIsRightHovered] = useState(false);

  const leftVideoRefs = useRef([]);

  // Auto-play Left Slides
  useEffect(() => {
    if (isLeftHovered) return;
    const interval = setInterval(() => {
      setLeftIndex((prev) => (prev + 1) % leftSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isLeftHovered]);

  // Handle Video Playback on Left Side
  useEffect(() => {
    leftVideoRefs.current.forEach((video, idx) => {
      if (video) {
        if (idx === leftIndex) {
          video.currentTime = 0;
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {});
          }
        } else {
          video.pause();
        }
      }
    });
  }, [leftIndex]);

  // Auto-play Right Slides
  useEffect(() => {
    if (isRightHovered) return;
    const interval = setInterval(() => {
      setRightIndex((prev) => (prev + 1) % rightSlides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isRightHovered]);

  const handlePrevLeft = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLeftIndex((prev) => (prev - 1 + leftSlides.length) % leftSlides.length);
  };

  const handleNextLeft = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLeftIndex((prev) => (prev + 1) % leftSlides.length);
  };

  return (
    <div className="w-full px-2 sm:px-3 lg:px-4 py-2 sm:py-3">
      <div className="w-full flex flex-col lg:flex-row items-stretch gap-2.5 sm:gap-3.5 h-auto lg:h-[600px] xl:h-[660px]">
        
        {/* =========================================
            LEFT SECTION: Thoda sa Bada Rectangle (~58%)
           ========================================= */}
        <div
          className="w-full lg:w-[58%] h-[400px] sm:h-[480px] md:h-[540px] lg:h-full relative rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-900 shadow-sm group select-none"
          onMouseEnter={() => setIsLeftHovered(true)}
          onMouseLeave={() => setIsLeftHovered(false)}
        >
          {/* Media Slides (Videos with Fallback Images) */}
          {leftSlides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === leftIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {slide.type === 'video' ? (
                <video
                  ref={(el) => (leftVideoRefs.current[idx] = el)}
                  src={slide.src}
                  muted
                  playsInline
                  loop
                  preload="metadata"
                  poster={slide.fallbackImage}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={slide.image || slide.fallbackImage}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ))}

      

          {/* Navigation Arrows (Desktop hover) */}
          <div className="hidden sm:flex items-center gap-2 absolute bottom-6 right-6 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handlePrevLeft}
              className="p-2.5 rounded-full bg-white/30 backdrop-blur-md hover:bg-white text-white hover:text-gray-900 transition-all shadow-md active:scale-90"
              aria-label="Previous slide"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextLeft}
              className="p-2.5 rounded-full bg-white/30 backdrop-blur-md hover:bg-white text-white hover:text-gray-900 transition-all shadow-md active:scale-90"
              aria-label="Next slide"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>


        {/* =========================================
            RIGHT SECTION: Chota sa Rectangle (~42%)
            (Matches D'you style reference image)
           ========================================= */}
        <div
          className="w-full lg:w-[42%] h-[400px] sm:h-[480px] md:h-[540px] lg:h-full relative rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-900 shadow-sm group select-none cursor-pointer"
          onMouseEnter={() => setIsRightHovered(true)}
          onMouseLeave={() => setIsRightHovered(false)}
        >
          {/* Images Carousel */}
          {rightSlides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === rightIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.category}
                className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
            </div>
          ))}

          {/* Subtle Bottom Vignette for Tagline Contrast */}
 
          {/* Right Section Content */}
          <Link href={rightSlides[rightIndex].link} className="absolute inset-0 z-20 flex flex-col justify-between p-5 sm:p-7 md:p-8">
            {/* Top Category Tag */}
            <div className="flex justify-end">
              <span className="text-[11px] sm:text-xs font-semibold   backdrop-blur-md border border-white/20 text-white">
               </span>
            </div>

            {/* Bottom Tagline & Slide Pill Indicators */}
            <div className="text-center space-y-4 pb-2">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif italic text-white tracking-wide leading-tight drop-shadow-lg px-2 max-w-lg mx-auto">
                &ldquo;{rightSlides[rightIndex].tagline}&rdquo;
              </h3>

              {/* Minimalist Pill Progress Indicators (Exact D'you reference design) */}
              <div className="flex items-center justify-center gap-1.5 pt-1">
                {rightSlides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setRightIndex(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === rightIndex
                        ? 'w-7 bg-white shadow-sm'
                        : 'w-2 bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}

