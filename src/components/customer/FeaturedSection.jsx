'use client';

import { useState, useEffect, useRef } from 'react';
import ProductCard from '@/components/customer/ProductCard';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function FeaturedSection({ products }) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const autoScrollRef = useRef(null);

  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, [products]);

  // Auto-scroll effect
  useEffect(() => {
    if (!products || products.length === 0) return;

    const startAutoScroll = () => {
      autoScrollRef.current = setInterval(() => {
        if (!isPaused) {
          const container = scrollContainerRef.current;
          if (!container) return;

          // Check if we've reached the end
          const isAtEnd = container.scrollLeft >= container.scrollWidth - container.clientWidth - 10;

          if (isAtEnd) {
            // Smoothly scroll back to start
            container.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            // Scroll to the right by one card width
            const cardWidth = container.firstChild?.offsetWidth || 300;
            container.scrollBy({ left: cardWidth, behavior: 'smooth' });
          }

          setTimeout(checkScrollability, 300);
        }
      }, 3000);
    };

    startAutoScroll();

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [products, isPaused]);

  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = direction === 'left' ? -400 : 400;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });

    setTimeout(checkScrollability, 300);
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#F8F6F3]">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-base lg:text-xl font- text-gray-900">
              Featured Products
            </h2>
            <p className="text-gray-600 text-xs">Handpicked wellness essentials for you</p>
          </div>

          {/* Desktop Navigation Arrows */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-3 rounded-full border-2 transition-all ${canScrollLeft
                  ? 'border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white'
                  : 'border-gray-200 text-gray-300 cursor-not-allowed'
                }`}
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-3 rounded-full border-2 transition-all ${canScrollRight
                  ? 'border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white'
                  : 'border-gray-200 text-gray-300 cursor-not-allowed'
                }`}
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Products Carousel */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollability}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {products.map((product) => (
              <div key={product._id} className="flex-shrink-0 w-40 md:w-72 ">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
