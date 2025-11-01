'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function HeroBanner({ banners }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || banners.length <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, banners.length, nextSlide]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  if (!banners || banners.length === 0) {
    return (
      <div className="w-full h-[400px] md:h-[500px] bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to NatureMedica</h1>
          <p className="text-xl md:text-2xl mb-8">Your Trusted Source for Natural Wellness</p>
          <Link 
            href="/products"
            className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition inline-block"
          >
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-[100px] md:h-[400px] overflow-hidden bg-gray-200"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slides */}
      {banners.map((banner, index) => (
        <div
          key={banner._id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {banner.link ? (
            <Link href={banner.link} className="block w-full h-full">
              <div className="relative w-full h-full">
                <Image
                  src={banner.image.url}
                  alt={banner.title || 'Banner'}
                  fill
                  className="object-cover w-full h-full"
                  priority={index === 0}
                  quality={90}
                />
                
              {/* Overlay with text */}
              {/* {(banner.title || banner.subtitle) && (
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                  <div className="container mx-auto px-4 sm:px-6 md:px-8">
                    <div className="max-w-2xl text-white">
                      {banner.title && (
                        <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 animate-fade-in-up">
                          {banner.title}
                        </h2>
                      )}
                      {banner.subtitle && (
                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 animate-fade-in-up animation-delay-200">
                          {banner.subtitle}
                        </p>
                      )}
                      <button className="bg-green-600 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg hover:bg-green-700 transition font-semibold text-xs sm:text-sm md:text-base animate-fade-in-up animation-delay-400">
                        Shop Now
                      </button>
                    </div>
                  </div>
                </div>
              )} */}
              </div>
            </Link>
          ) : (
            <div className="relative w-full h-full">
              <Image
                src={banner.image.url}
                alt={banner.title || 'Banner'}
                fill
                className="object-cover w-full h-full"
                priority={index === 0}
                quality={90}
              />
              
              {/* Overlay with text */}
              {/* {(banner.title || banner.subtitle) && (
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                  <div className="container mx-auto px-4 md:px-8">
                    <div className="max-w-2xl text-white">
                      {banner.title && (
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
                          {banner.title}
                        </h2>
                      )}
                      {banner.subtitle && (
                        <p className="text-lg md:text-xl lg:text-2xl mb-6">
                          {banner.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )} */}
            </div>
          )}
        </div>
      ))}

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 md:p-3 transition shadow-lg"
            aria-label="Previous slide"
          >
            <FiChevronLeft className="text-gray-800 text-xl md:text-2xl" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 md:p-3 transition shadow-lg"
            aria-label="Next slide"
          >
            <FiChevronRight className="text-gray-800 text-xl md:text-2xl" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all rounded-full ${
                index === currentSlide
                  ? 'bg-white w-8 h-3'
                  : 'bg-white/50 hover:bg-white/75 w-3 h-3'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Auto-play indicator */}
      {/* {banners.length > 1 && (
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="bg-white/80 hover:bg-white rounded-full p-2 transition"
            aria-label={isAutoPlaying ? 'Pause auto-play' : 'Resume auto-play'}
          >
            {isAutoPlaying ? (
              <svg className="w-4 h-4 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
        </div>
      )} */}
    </div>
  );
}
