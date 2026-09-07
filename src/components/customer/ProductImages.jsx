'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight, FiMaximize2, FiX, FiShield } from 'react-icons/fi';
import { Sparkles } from 'lucide-react';

export default function ProductImages({ images = [], title = 'Product Image', customBadge = '' }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const touchStartRef = useRef(0);
  const touchEndRef = useRef(0);

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isModalOpen) return;
      if (e.key === 'Escape') setIsModalOpen(false);
      if (e.key === 'ArrowRight') setSelectedImage((prev) => (prev + 1) % images.length);
      if (e.key === 'ArrowLeft') setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, images.length]);

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-[#f4f7f2] border border-gray-100 flex flex-col items-center justify-center text-gray-400">
        <svg className="w-16 h-16 text-gray-300 stroke-[1.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-[12px] mt-2 text-gray-400 font-medium">No image available</p>
      </div>
    );
  }

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e?.stopPropagation();
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentImgUrl = images[selectedImage]?.url || images[0]?.url || '/placeholder.png';

  return (
    <div className="w-full">
      <div className="flex flex-col-reverse md:flex-row gap-3 sm:gap-4">
        {/* Vertical Thumbnails (Desktop) / Horizontal (Mobile) */}
        {images.length > 1 && (
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-h-[540px] no-scrollbar py-1 md:py-0 md:w-16 lg:w-20 flex-shrink-0">
            {images.map((image, index) => {
              const isSelected = selectedImage === index;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  onMouseEnter={() => setSelectedImage(index)}
                  className={`relative w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl overflow-hidden bg-[#f4f7f2] transition-all duration-200 flex-shrink-0 group ${
                    isSelected
                      ? 'ring-2 ring-[#2d4e24] shadow-xs scale-[1.02]'
                      : 'border border-gray-100 hover:border-[#2d4e24]/40 opacity-75 hover:opacity-100'
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <Image
                    src={image.url || '/placeholder.png'}
                    alt={`${title} - Thumbnail ${index + 1}`}
                    fill
                    sizes="80px"
                    className="object-contain p-1 transition-transform duration-300 group-hover:scale-105"
                  />
                  {isSelected && (
                    <span className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-[#2d4e24] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Main Image Stage matching Home style (f4f7f2 rounded box) */}
        <div className="relative flex-1 rounded-2xl sm:rounded-3xl overflow-hidden bg-[#f4f7f2] border border-gray-100 shadow-2xs">
          {/* Top Badges matching home badge pill style */}
          <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5 pointer-events-none">
            {customBadge ? (
              <span className="px-2.5 py-0.5 text-[11px] font-bold tracking-wide uppercase rounded-full bg-[#2d4e24] text-white shadow-2xs flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                {customBadge}
              </span>
            ) : (
              <span className="px-2.5 py-0.5 text-[11px] font-bold tracking-wide uppercase rounded-full bg-[#eef5ec] text-[#2d4e24] border border-[#2d4e24]/20 shadow-2xs flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#2d4e24]" />
                100% Ayurvedic
              </span>
            )}
            <span className="px-2.5 py-0.5 text-[11px] font-semibold tracking-wide rounded-full bg-white text-gray-700 border border-gray-200 shadow-2xs flex items-center gap-1">
              <FiShield className="w-3 h-3 text-[#2d4e24]" />
              AYUSH Certified
            </span>
          </div>

          {/* Fullscreen Action */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 text-gray-600 hover:text-[#2d4e24] hover:bg-white shadow-2xs border border-gray-200 transition-all duration-200 hover:scale-105"
            title="Click to expand view"
            aria-label="Expand image"
          >
            <FiMaximize2 className="w-3.5 h-3.5" />
          </button>

          {/* Main Stage Display Area */}
          <div
            className="relative aspect-square sm:aspect-[4/4.2] md:h-[480px] lg:h-[520px] w-full flex items-center justify-center cursor-crosshair overflow-hidden group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={(e) => {
              touchStartRef.current = e.touches[0].clientX;
            }}
            onTouchMove={(e) => {
              touchEndRef.current = e.touches[0].clientX;
            }}
            onTouchEnd={() => {
              const diff = touchStartRef.current - touchEndRef.current;
              if (Math.abs(diff) > 40) {
                if (diff > 0) handleNext();
                else handlePrev();
              }
              touchStartRef.current = 0;
              touchEndRef.current = 0;
            }}
            onClick={() => setIsModalOpen(true)}
          >
            {/* Standard Image */}
            <div
              className={`relative w-full h-full transition-opacity duration-300 ${
                isHovered ? 'opacity-0 md:opacity-0' : 'opacity-100'
              }`}
            >
              <Image
                src={currentImgUrl}
                alt={title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 45vw"
                className="object-contain p-4 md:p-6 select-none transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>

            {/* Desktop Smooth Hover Zoom Loupe */}
            {isHovered && (
              <div
                className="hidden md:block absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-200"
                style={{
                  backgroundImage: `url(${currentImgUrl})`,
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  backgroundSize: '220%',
                  backgroundRepeat: 'no-repeat',
                }}
              />
            )}

            {/* Desktop Nav Arrows */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-gray-700 hover:text-[#2d4e24] hover:bg-white items-center justify-center shadow-xs border border-gray-200 transition-all opacity-0 group-hover:opacity-100 hover:scale-105 z-10"
                  aria-label="Previous image"
                >
                  <FiChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-gray-700 hover:text-[#2d4e24] hover:bg-white items-center justify-center shadow-xs border border-gray-200 transition-all opacity-0 group-hover:opacity-100 hover:scale-105 z-10"
                  aria-label="Next image"
                >
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Mobile Image Counter Pill */}
            {images.length > 1 && (
              <div className="md:hidden absolute bottom-3 right-3 z-10 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold tracking-wider">
                {selectedImage + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox / Fullscreen Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative max-w-4xl w-full h-[80vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={currentImgUrl}
                alt={title}
                fill
                className="object-contain select-none"
                sizes="100vw"
                priority
              />
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 md:top-4 md:right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-all z-20"
              aria-label="Close modal"
            >
              <FiX className="w-5 h-5" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-all z-20"
                  aria-label="Previous image"
                >
                  <FiChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-all z-20"
                  aria-label="Next image"
                >
                  <FiChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-[11px] font-medium tracking-wide bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">
              {selectedImage + 1} of {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
