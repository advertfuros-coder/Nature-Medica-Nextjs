'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'Ananya Singh',
    age: '30Yrs',
    image: 'https://thumbs.dreamstime.com/b/passport-photo-young-arabic-woman-isolated-white-background-cut-out-73451979.jpg',
    product: 'Aloe Vera Hydrating Night Face Gel',
    rating: 5,
    review: 'Wakes up my skin feeling fresh, soft, and deeply hydrated every morning!',
  },
  {
    id: 2,
    name: 'Priya Patel',
    age: '34Yrs',
    image: 'https://img.freepik.com/premium-photo/indian-girl-cheerful-studio-portrait_53876-55599.jpg',
    product: 'Nature Medica 24K Gold Face Serum',
    rating: 5,
    review: 'Gives my skin an instant glow and a luxurious golden radiance!',
  },
  {
    id: 3,
    name: 'Sneha Reddy',
    age: '32Yrs',
    image: 'https://thumbs.dreamstime.com/b/portret-van-vrolijke-indische-jonge-vrouw-84999968.jpg',
    product: 'Nature Medica Glutathione Foaming FaceWash',
    rating: 5,
    review: 'Cleanses gently while making my skin look visibly brighter and refreshed.',
  },
  {
    id: 4,
    name: 'Kavya Sharma',
    age: '28Yrs',
    image: 'https://i.pinimg.com/474x/e4/a8/cf/e4a8cf2b3534ea19918479d35ecb9cc8.jpg',
    product: 'Aloe Vera Hydrating Night Face Gel',
    rating: 5,
    review: 'So soothing and moisturizing — my skin feels calm and rejuvenated overnight.',
  },
  {
    id: 5,
    name: 'Isha Gupta',
    age: '35Yrs',
    image: 'https://c8.alamy.com/zooms/9/b3cfd6ff7174437583ab2cb8da95c9a3/rdxmmm.jpg',
    product: 'Nature Medica 24K Gold Face Serum',
    rating: 5,
    review: 'Adds a beautiful glow and smooth texture to my skin after just a few uses!',
  },
];

export default function CustomerReviewsCompact() {
  return (
    <section className="bg-white pt-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-5">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Reviews</h2>
          <p className="text-[10px] text-gray-500">What customers say</p>
        </div>

        <div className="relative">

          <div className="overflow-hidden w-full">
            <div
              className="flex gap-3"
              style={{
                animation: "marquee 20s linear infinite",
                width: "max-content"
              }}
            >
              {reviews.concat(reviews).map((review, idx) => (
                <div
                  key={`${review.id}-${idx}`}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-[#415f2d] transition-all w-64 shrink-0"
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
                      <p className="font-semibold text-[11px] text-gray-900 truncate">
                        {review.name}
                      </p>
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

            <style jsx>{`
              @keyframes marquee {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(-50%);
                }
              }
            `}</style>
          </div>

        </div>
      </div>
    </section>
  );
}
