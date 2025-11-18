'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ProductImages({ images = [], title }) {
  const [selectedImage, setSelectedImage] = useState(0);

  // Fallback if no images
  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
        <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="  ">
      {/* Main Image */}
      <div className="relative  h-80 mb-6 rounded-xl overflow-hidden bg-white shadow-lg transition-shadow duration-300 hover:shadow-2xl">
        <Image
          src={images[selectedImage]?.url || '/placeholder.png'}
          alt={title}
          fill
          priority={selectedImage === 0}
          className="object-contain p-4"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="grid grid-cols-6 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square rounded-lg overflow-hidden bg-white transition-all duration-200 ${
                selectedImage === index
                  ? 'ring-2 ring-[#415f2d] shadow-md scale-105'
                  : 'ring-1 ring-gray-200 hover:ring-[#415f2d] hover:shadow-md'
              }`}
            >
              <Image
                src={image.url}
                alt={`${title} - View ${index + 1}`}
                fill
                className="object-contain p-1"
                sizes="(max-width: 768px) 25vw, 15vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
