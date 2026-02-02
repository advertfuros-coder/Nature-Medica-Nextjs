'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// const videoPaths = [
//   'https://res.cloudinary.com/dnhak76jd/video/upload/c_limit,f_auto,q_auto,w_1280/v1764007920/nature_medica_hero_all.mp4',
//   '/b3.mp4',
//   '/b4.mp4',
//   '/b1.mp4'
// ];

const bannerImages = [
  '/banner/1.jpeg',
  '/banner/2.jpeg',
  '/banner/3.jpeg',
];

// Separate Video component to handle individual video playback
/*
function Video({ src, isActive }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      // Play the video when it becomes active
      video.play().catch(error => {
        console.log('Video autoplay prevented:', error);
        // Autoplay was prevented, user interaction needed
      });
    } else {
      // Pause and reset when not active
      video.pause();
      video.currentTime = 0;
    }
  }, [isActive]);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      playsInline
      loop
      preload="auto"
      className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
        }`}
      onError={(e) => {
        console.error('Video failed to load:', src, e);
      }}
    />
  );
}
*/

export default function HeroBanner({ banners }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (!isAutoPlaying || bannerImages.length <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 4000); // Changed to 4s for images as 2s is too fast

    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  if ((!banners || banners.length === 0) && bannerImages.length === 0) {
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
      className="relative w-full h-[150px] md:h-[500px]  overflow-hidden bg-gray-200"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >

      {/* {videoPaths.map((video, index) => (
        <Video
          key={index}
          src={video}
          isActive={index === currentSlide}
        />
      ))} */}

      {bannerImages.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Banner ${index + 1}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
        />
      ))}

      {/* Navigation Arrows */}
      {bannerImages.length > 1 && (
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

    </div>
  );
}
