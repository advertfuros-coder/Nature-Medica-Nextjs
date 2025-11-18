'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
const videoPaths = ['/b2.mp4','/b5.mp4','/b1.mp4', '/men.mp4', '/sleep.mp4', '/gt.mp4'  ];

export default function WellnessGoalCarousel() {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  const wellnessGoals = [
    { id: 1, label: 'Serum', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=600&fit=crop', href: '/products?search=serum' },
    { id: 2, label: 'Cold Cream', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop', href: '/products?search=cream' },
    { id: 3, label: 'Facewash', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&h=600&fit=crop', href: '/products?search=facewash' },
    { id: 4, label: 'Men Suppliments', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=600&fit=crop', href: '/products?search=men' },
    { id: 5, label: 'Sleep & Relaxation', image: 'https://images.unsplash.com/photo-1544316278-ca5e3cff5fbf?w=500&h=600&fit=crop', href: '/products/sleep' },
    { id: 6, label: 'Green Tea', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop', href: '/products/medicines-healthcare' },
  ];

  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, []);

  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
  };

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollAmount = direction === 'left' ? -400 : 400;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(checkScrollability, 300);
  };

  const handleTouchStart = (e) => setTouchStartX(e.touches[0].clientX);
  const handleTouchMove = (e) => setTouchEndX(e.touches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50) scroll('right');
    if (touchStartX - touchEndX < -50) scroll('left');
    setTouchStartX(0);
    setTouchEndX(0);
  };

  return (
    <section className="w-full pt-3  bg-white">
    

      {/* Scrollable Carousel */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollability}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {wellnessGoals.map((goal, index) => (
            <Link 
              key={goal.id} 
              href={goal.href}
              className="flex-shrink-0 w-30 md:w-54 cursor-pointer group"
            >
              <div className="relative rounded-2xl overflow-hidden h-40 md:h-60 shadow-lg hover:shadow-xl transition-all duration-300">
                <video
                  src={videoPaths[index % videoPaths.length]}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className=" text-white text-xs">{goal.label}</h3>
                </div>
              </div>
            </Link>
          ))}
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
