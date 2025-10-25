'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function CategorySection({ categories }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
      {categories.map((category, index) => (
        <Link
          key={category._id}
          href={`/products?category=${category.slug}`}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="group"
        >
          <div className="bg-white  transition-all duration-300 p-4 md:p-6 text-center transform hover:scale-105">
            {/* Category Image or Icon */}
            {category.image?.url ? (
              <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-4">
                <Image
                  src={category.image.url}
                  alt={category.name}
                  fill
                  className="object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            ) : category.icon ? (
              <div className="text-5xl md:text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </div>
            ) : (
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-2xl md:text-3xl font-bold">
                  {category.name.charAt(0)}
                </span>
              </div>
            )}

            {/* Category Name */}
            <h3 className="font-semibold text-xs md:text-sm text-center mx-auto text-gray-800 group-hover:text-green-600 transition-colors duration-300 line-clamp-2">
              {category.name}
            </h3>

            {/* Hover Effect - Description */}
            {/* {category.description && (
              <p className={`text-xs text-gray-500 mt-2 transition-all duration-300 ${
                hoveredIndex === index ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0'
              } overflow-hidden`}>
                {category.description}
              </p>
            )} */}

            {/* Arrow Icon on Hover */}
            {/* <div className={`mt-3 transition-all duration-300 ${
              hoveredIndex === index ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
            }`}>
              <span className="text-green-600 text-sm font-semibold flex items-center justify-center gap-1">
                Explore
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div> */}
          </div>
        </Link>
      ))}
    </div>
  );
}
