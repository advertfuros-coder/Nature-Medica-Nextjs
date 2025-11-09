'use client';

import { useState, useEffect, useRef } from 'react';
import ProductCard from '@/components/customer/ProductCard';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const CACHE_KEY = 'newArrivalProductsCache';
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

export default function NewArrivalSection({ products }) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [cachedProducts, setCachedProducts] = useState(null);

  useEffect(() => {
    // Check localStorage cache first
    const cachedDataRaw = localStorage.getItem(CACHE_KEY);
    if (cachedDataRaw) {
      const cachedData = JSON.parse(cachedDataRaw);
      if (cachedData.timestamp && (Date.now() - cachedData.timestamp < CACHE_EXPIRY_MS)) {
        setCachedProducts(cachedData.products);
        return;
      } else {
        localStorage.removeItem(CACHE_KEY);
      }
    }

    // No valid cache - use fresh and cache it
    setCachedProducts(products);
    localStorage.setItem(CACHE_KEY, JSON.stringify({ products, timestamp: Date.now() }));
  }, [products]);

  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, [cachedProducts]);

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

  if (!cachedProducts || cachedProducts.length === 0) {
    return null;
  }

  return (
    <section className="bg-white mt-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-base lg:text-xl font- bg-yellow-00  text-gray-900 mb-">
             New Arrivals
            </h2>
            <p className="text-gray-600 text-[12px]">Fresh additions to our wellness collection</p>
          </div>

          {/* Desktop Navigation Arrows */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-3 rounded-full border-2 transition-all ${
                canScrollLeft
                  ? 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                  : 'border-gray-200 text-gray-300 cursor-not-allowed'
              }`}
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-3 rounded-full border-2 transition-all ${
                canScrollRight
                  ? 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
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
            className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {cachedProducts.map((product) => (
              <div
                key={product._id}
                className="flex-shrink-0 w-44 md:w-72 "
              >
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
