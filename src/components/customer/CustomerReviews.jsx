'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'Omkar Rao',
    age: '30Yrs',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    product: 'Magnesium Glycinate Men',
    rating: 5,
    review: 'This has helped a lot with my muscle recovery and sleep.',
  },
  {
    id: 2,
    name: 'Ishani Sehgal',
    age: '34Yrs',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    product: 'Marine Collagen',
    rating: 5,
    review: 'My skin looks so healthy and glowing now.',
  },
  {
    id: 3,
    name: 'Arjun Dubey',
    age: '32Yrs',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    product: 'DHT Blocker with Biotin',
    rating: 5,
    review: 'Restored my confidence significantly.',
  },
  {
    id: 4,
    name: 'Priya Sharma',
    age: '28Yrs',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    product: 'Ashwagandha Capsules',
    rating: 5,
    review: 'My stress levels have reduced significantly.',
  },
  {
    id: 5,
    name: 'Rahul Mehta',
    age: '35Yrs',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    product: 'Vitamin D3 + K2',
    rating: 5,
    review: 'No more joint pain. Highly recommend!',
  },
];

export default function CustomerReviewsCompact() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [cardsToShow, setCardsToShow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      setCardsToShow(window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
      setIsAnimating(false);
    }, 300);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
      setIsAnimating(false);
    }, 300);
  };

  const getVisibleReviews = () => {
    const visible = [];
    for (let i = 0; i < cardsToShow; i++) {
      visible.push(reviews[(currentIndex + i) % reviews.length]);
    }
    return visible;
  };

  return (
    <section className="bg-white pt-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-5">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Reviews</h2>
          <p className="text-[10px] text-gray-500">What customers say</p>
        </div>

        <div className="relative">
          <button 
            onClick={handlePrev}
            className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-10 w-7 h-7 bg-white border border-gray-200 rounded-full items-center justify-center hover:bg-[#415f2d] hover:text-white transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <button 
            onClick={handleNext}
            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-10 w-7 h-7 bg-white border border-gray-200 rounded-full items-center justify-center hover:bg-[#415f2d] hover:text-white transition-all"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 transition-opacity duration-300 ${
            isAnimating ? 'opacity-0' : 'opacity-100'
          }`}>
            {getVisibleReviews().map((review, idx) => (
              <div
                key={`${review.id}-${idx}`}
                className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-[#415f2d] transition-all"
              >
                <Quote className="w-4 h-4 text-[#415f2d] mb-2" />
                
                <p className="text-[11px] text-gray-700 leading-relaxed mb-3 line-clamp-2">
                  {review.review}
                </p>

                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[11px] text-gray-900 truncate">{review.name}</p>
                    <div className="flex gap-0.5">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>

                <span className="text-[9px] text-gray-500">{review.product}</span>
              </div>
            ))}
          </div>

 

          <div className="flex justify-center gap-1 mt-3">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all rounded-full ${
                  index === currentIndex ? 'bg-[#415f2d] w-5 h-1.5' : 'bg-gray-300 w-1.5 h-1.5'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
