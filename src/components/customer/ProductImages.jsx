'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

export default function ProductImages({ images = [], title }) {
  const [current, setCurrent] = useState(0);

  const touchStart = useRef(0);
  const touchMove = useRef(0);

  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchMove.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStart.current - touchMove.current;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Left swipe → next
        setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      } else {
        // Right swipe → previous
        setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
    }

    touchStart.current = 0;
    touchMove.current = 0;
  };

  if (!images || images.length === 0) {
    return <div>No images</div>;
  }

  return (
    <div className="w-full">
      {/* BIG IMAGE AREA */}
      <div
        className="relative overflow-hidden rounded-xl bg-white h-[380px]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* ALL IMAGES IN ONE LONG ROW */}
        <div
          className="flex h-full transition-transform duration-300 ease-out"
        
        >
          {images.map((img, i) => (
            <div key={i} className="w-full flex-shrink-0 relative h-full">
              <Image
                src={img.url}
                alt={title}
                fill
                className="object-cover pointer-events-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* DOT INDICATORS (Myntra Style) */}
      <div className="flex justify-center mt-3 gap-2">
        {images.map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full transition-all ${
              i === current ? 'bg-[#415f2d] scale-125' : 'bg-gray-300'
            }`}
          ></span>
        ))}
      </div>

      {/* THUMBNAILS */}
      <div className="grid grid-cols-6 gap-2 mt-3">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`relative aspect-square rounded-lg overflow-hidden bg-white transition-all duration-200 ${
              current === index
                ? 'ring-2 ring-[#415f2d] shadow-md scale-105'
                : 'ring-1 ring-gray-200 hover:ring-[#415f2d] hover:shadow-md'
            }`}
          >
            <Image
              src={image.url}
              alt={`${title} - View ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}