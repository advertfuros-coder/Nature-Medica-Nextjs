'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiZoomIn, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function ProductImages({ images, title }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <span className="text-gray-400">No image available</span>
        </div>
      </div>
    );
  }

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
  };

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div>
      {/* Main Image */}
      <div className="relative aspect-square mb-4 rounded-xl overflow-hidden bg-white shadow-lg group">
        <img
          src={images[selectedImage]?.url || '/placeholder.png'}
          alt={title}
          fill
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          priority
        />
        
        {/* Zoom Button */}
        <button
          onClick={() => openLightbox(selectedImage)}
          className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all opacity-0 group-hover:opacity-100"
        >
          <FiZoomIn className="w-5 h-5 text-gray-800" />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
          {selectedImage + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === index
                  ? 'border-green-600 ring-2 ring-green-200 shadow-md'
                  : 'border-gray-200 hover:border-green-300 hover:shadow-sm'
              }`}
            >
              <img
                src={image.url}
                alt={`${title} - ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox/Fullscreen Gallery */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition z-10"
          >
            <FiX className="w-6 h-6 text-white" />
          </button>

          {/* Previous Button */}
          {images.length > 1 && (
            <button
              onClick={prevImage}
              className="absolute left-6 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition z-10"
            >
              <FiChevronLeft className="w-6 h-6 text-white" />
            </button>
          )}

          {/* Main Lightbox Image */}
          <div className="relative w-full h-full max-w-5xl max-h-[90vh] p-12">
            <img
              src={images[lightboxIndex].url}
              alt={`${title} - ${lightboxIndex + 1}`}
              fill
              className="object-contain"
              quality={100}
            />
          </div>

          {/* Next Button */}
          {images.length > 1 && (
            <button
              onClick={nextImage}
              className="absolute right-6 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition z-10"
            >
              <FiChevronRight className="w-6 h-6 text-white" />
            </button>
          )}

          {/* Image Counter in Lightbox */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-20 text-white px-4 py-2 rounded-full">
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Thumbnail Navigation in Lightbox */}
          {images.length > 1 && (
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-md overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setLightboxIndex(index)}
                  className={`relative w-16 h-16 flex-shrink-0 rounded border-2 transition ${
                    lightboxIndex === index
                      ? 'border-green-500'
                      : 'border-white border-opacity-30 hover:border-opacity-60'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover rounded"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
