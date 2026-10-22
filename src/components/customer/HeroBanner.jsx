'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Fallback slides in case database has no entries
const fallbackLeftSlides = [
  {
    image: 'https://res.cloudinary.com/dnhak76jd/image/upload/v1792066735/naturemedica/banners/hero-sea-buckthorn-juice.png',
    badge: 'Rich in Vitamin C & Omega 3,6,7,9',
    title: 'Pure Sea Buckthorn Juice',
    subtitle: 'Potent natural antioxidants for heart, skin & vitality',
    link: '/products/sea-buckthorn-juice-500ml-nature-medica',
  },
  {
    image: 'https://res.cloudinary.com/dnhak76jd/image/upload/v1792066750/naturemedica/banners/hero-omega-capsule.png',
    badge: '100% Pure & Natural',
    title: 'Omega-3 Fish Oil Capsules',
    subtitle: 'Supports heart health, promotes brain function & active vitality',
    link: '/products/omega-3-fish-oil-capsules-1000mg-30-capsules',
  },
  {
    image: 'https://res.cloudinary.com/dnhak76jd/image/upload/v1788359374/naturemedica/banners/hero-glutathione-wash.png',
    badge: '100% Ayurvedic & Natural',
    title: 'Pure Herbal Formulations',
    subtitle: 'Crafted for daily radiance & deep nourishment',
    link: '/products',
  },
  {
    image: 'https://res.cloudinary.com/dnhak76jd/image/upload/v1788359371/naturemedica/banners/hero-glow-wellness.png',
    badge: 'Clean & Toxin-Free',
    title: 'Glow That Speaks For Itself',
    subtitle: 'Gentle, potent, and restorative wellness',
    link: '/products',
  },
];

const fallbackRightSlides = [
  {
    image: 'https://res.cloudinary.com/dnhak76jd/image/upload/v1792066735/naturemedica/banners/hero-sea-buckthorn-juice.png',
    tagline: 'nourish your body from within with pure sea buckthorn',
    categoryName: 'Sea Buckthorn Juice',
    link: '/products/sea-buckthorn-juice-500ml-nature-medica',
  },
  {
    image: 'https://res.cloudinary.com/dnhak76jd/image/upload/v1792066750/naturemedica/banners/hero-omega-capsule.png',
    tagline: 'fuel your heart and mind with pure omega vitality',
    categoryName: 'Omega-3 Capsules',
    link: '/products/omega-3-fish-oil-capsules-1000mg-30-capsules',
  },
  {
    image: 'https://res.cloudinary.com/dnhak76jd/image/upload/v1788359369/naturemedica/banners/hero-face-care-serums.png',
    tagline: "products that work hard, so you don't have to",
    categoryName: 'Face Care & Serums',
    link: '/products',
  },
  {
    image: 'https://res.cloudinary.com/dnhak76jd/image/upload/v1788359367/naturemedica/banners/hero-daily-skincare.png',
    tagline: 'pure natural ingredients, real lasting glow',
    categoryName: 'Daily Skincare Routine',
    link: '/products',
  },
  {
    image: 'https://res.cloudinary.com/dnhak76jd/image/upload/v1788359378/naturemedica/banners/hero-herbal-hydration.png',
    tagline: 'nourish your skin from deep within',
    categoryName: 'Herbal Hydration',
    link: '/products?sort=bestseller',
  },
  {
    image: 'https://res.cloudinary.com/dnhak76jd/image/upload/v1788359383/naturemedica/banners/hero-mango-cream.png',
    tagline: 'experience authentic ayurvedic harmony',
    categoryName: 'Wellness & Body',
    link: '/products',
  },
];

export default function HeroBanner({ banners = [], leftBanners = [], rightBanners = [], previewMode = false }) {
  // Normalize incoming props:
  // If leftBanners / rightBanners provided directly, use them.
  // Otherwise filter from general banners list.
  const activeLeft = leftBanners.length > 0
    ? leftBanners
    : (banners || []).filter((b) => b.type === 'hero_left' && b.active !== false);

  const activeRight = rightBanners.length > 0
    ? rightBanners
    : (banners || []).filter((b) => b.type === 'hero_right' && b.active !== false);

  // Map to uniform structure
  const leftSlides = activeLeft.length > 0
    ? activeLeft.map((b) => ({
        image: b.image?.url || b.image,
        badge: b.badge || '',
        title: b.title || '',
        subtitle: b.subtitle || '',
        link: b.link || '/products',
      }))
    : fallbackLeftSlides;

  const rightSlides = activeRight.length > 0
    ? activeRight.map((b) => ({
        image: b.image?.url || b.image,
        tagline: b.tagline || '',
        categoryName: b.categoryName || '',
        link: b.link || '/products',
      }))
    : fallbackRightSlides;

  // Left Section State
  const [leftIndex, setLeftIndex] = useState(0);
  const [isLeftHovered, setIsLeftHovered] = useState(false);

  // Right Section State
  const [rightIndex, setRightIndex] = useState(0);
  const [isRightHovered, setIsRightHovered] = useState(false);

  // Auto-play Left Slides
  useEffect(() => {
    if (isLeftHovered || leftSlides.length <= 1) return;
    const interval = setInterval(() => {
      setLeftIndex((prev) => (prev + 1) % leftSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isLeftHovered, leftSlides.length]);

  // Keep indices in bounds if slide array changes dynamically
  useEffect(() => {
    if (leftIndex >= leftSlides.length) setLeftIndex(0);
  }, [leftSlides.length, leftIndex]);

  useEffect(() => {
    if (rightIndex >= rightSlides.length) setRightIndex(0);
  }, [rightSlides.length, rightIndex]);

  // Auto-play Right Slides
  useEffect(() => {
    if (isRightHovered || rightSlides.length <= 1) return;
    const interval = setInterval(() => {
      setRightIndex((prev) => (prev + 1) % rightSlides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isRightHovered, rightSlides.length]);

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

  const currentLeft = leftSlides[leftIndex] || leftSlides[0];
  const currentRight = rightSlides[rightIndex] || rightSlides[0];

  const LeftWrapper = previewMode ? 'div' : Link;
  const RightWrapper = previewMode ? 'div' : Link;

  return (
    <div className={`w-full ${previewMode ? 'p-1' : 'px-2 sm:px-3 lg:px-4 py-2 sm:py-3'}`}>
      <div className={`w-full flex flex-col lg:flex-row items-stretch gap-2.5 sm:gap-3.5 ${
        previewMode ? 'h-auto lg:h-[380px]' : 'h-auto lg:h-[600px] xl:h-[660px]'
      }`}>
        
        {/* =========================================
            LEFT SECTION: Large Hero Banner (~58%)
           ========================================= */}
        <div
          className={`w-full lg:w-[58%] relative rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-900 shadow-sm group select-none ${
            previewMode ? 'h-[260px] sm:h-[320px] lg:h-full' : 'h-[400px] sm:h-[480px] md:h-[540px] lg:h-full'
          }`}
          onMouseEnter={() => setIsLeftHovered(true)}
          onMouseLeave={() => setIsLeftHovered(false)}
        >
          {leftSlides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === leftIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <LeftWrapper
                href={slide.link || '/products'}
                className="block w-full h-full relative"
              >
                {slide.image && (
                  <Image
                    src={slide.image}
                    alt={slide.title || 'Nature Medica Hero Banner'}
                    fill
                    priority={idx === 0}
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover"
                  />
                )}
              </LeftWrapper>
            </div>
          ))}

          {/* Navigation Arrows for Left Slider */}
          {leftSlides.length > 1 && (
            <div className="hidden sm:flex items-center gap-2 absolute bottom-6 right-6 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                type="button"
                onClick={handlePrevLeft}
                className="p-2.5 rounded-full bg-white/30 backdrop-blur-md hover:bg-white text-white hover:text-gray-900 transition-all shadow-md active:scale-90 cursor-pointer"
                aria-label="Previous slide"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextLeft}
                className="p-2.5 rounded-full bg-white/30 backdrop-blur-md hover:bg-white text-white hover:text-gray-900 transition-all shadow-md active:scale-90 cursor-pointer"
                aria-label="Next slide"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Left Slide Pill Indicators */}
          {leftSlides.length > 1 && (
            <div className="absolute bottom-4 left-6 z-30 flex items-center gap-1.5">
              {leftSlides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setLeftIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === leftIndex
                      ? 'w-6 bg-white shadow-sm'
                      : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* =========================================
            RIGHT SECTION: Spotlight Carousel (~42%)
           ========================================= */}
        <div
          className={`w-full lg:w-[42%] relative rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-900 shadow-sm group select-none cursor-pointer ${
            previewMode ? 'h-[260px] sm:h-[320px] lg:h-full' : 'h-[400px] sm:h-[480px] md:h-[540px] lg:h-full'
          }`}
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
              {slide.image && (
                <Image
                  src={slide.image}
                  alt={slide.categoryName || 'Nature Medica Spotlight'}
                  fill
                  priority={idx === 0}
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover transform scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
              )}
            </div>
          ))}

          {/* Right Section Content & Overlay */}
          <RightWrapper
            href={currentRight?.link || '/products'}
            className="absolute inset-0 z-20 flex flex-col justify-between p-5 sm:p-7 md:p-8 bg-gradient-to-t from-black/40 via-transparent to-black/10"
          >
            {/* Top Category Tag */}
            <div className="flex justify-end">
              {currentRight?.categoryName && (
                <span className="text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-md bg-black/30 border border-white/20 text-white shadow-sm">
                  {currentRight.categoryName}
                </span>
              )}
            </div>

            {/* Bottom Tagline & Slide Pill Indicators */}
            <div className="text-center space-y-3 pb-2">
              {currentRight?.tagline && (
                <h3 className={`${previewMode ? 'text-lg sm:text-xl' : 'text-2xl sm:text-3xl md:text-4xl'} font-serif italic text-white tracking-wide leading-tight drop-shadow-lg px-2 max-w-lg mx-auto`}>
                  &ldquo;{currentRight.tagline}&rdquo;
                </h3>
              )}

              {/* Minimalist Pill Progress Indicators */}
              {rightSlides.length > 1 && (
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
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === rightIndex
                          ? 'w-7 bg-white shadow-sm'
                          : 'w-2 bg-white/50 hover:bg-white/80'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </RightWrapper>
        </div>

      </div>
    </div>
  );
}
