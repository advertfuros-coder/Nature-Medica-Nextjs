'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiChevronDown } from 'react-icons/fi';

const categories = [
  {
    id: 1,
    name: 'Face Serum',
    slug: 'face-serum',
    image: '/categories/serum.png',
    parentCategory: 'Face & Beauty Care'
  },
  {
    id: 2,
    name: 'Cold Cream',
    slug: 'cold-cream',
    image: '/categories/cold-cream.png',
    parentCategory: 'Face & Beauty Care'
  },
  {
    id: 3,
    name: 'Night Gel',
    slug: 'night-gel',
    image: '/categories/night-gel.png',
    parentCategory: 'Face & Beauty Care'
  },
  {
    id: 4,
    name: 'Perfume',
    slug: 'perfume',
    image: '/categories/perfumes.png',
    parentCategory: 'Face & Beauty Care'
  },
  {
    id: 5,
    name: 'Oral Care',
    slug: 'oral-care',
    image: '/categories/oral.png',
    parentCategory: 'Health & Wellness'
  },
  {
    id: 6,
    name: 'Shampoo',
    slug: 'shampoo',
    image: '/categories/shampoo.png',
    parentCategory: 'Hair Care'
  },
  {
    id: 7,
    name: 'Effervescent Tablets',
    slug: 'effervescent-tablets',
    image: '/categories/effervescent.png',
    parentCategory: 'Health & Wellness'
  },
  {
    id: 8,
    name: 'Ayurveda',
    slug: 'ayurvedic-remedies',
    image: '/categories/ayurveda.jpg',
    parentCategory: 'Health & Wellness'
  },
  {
    id: 9,
    name: 'Pregnancy Kit',
    slug: 'pregnancy-kit',
    image: '/categories/pregnancy.avif',
    parentCategory: "Women's Health"
  }
];

export default function CategoryGrid() {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Category Grid - Horizontal Scrollable on Mobile */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-6 md:gap-8 lg:gap-10 min-w-max md:min-w-0 md:grid md:grid-cols-4 lg:grid-cols-9 md:justify-items-center">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?search=${encodeURIComponent(category.name)}`}
                className="group flex flex-col items-center min-w-[90px] md:min-w-0"
              >
                {/* Image Container */}
                <div className="relative w-16 h-16 md:w-20 md:h-20 mb-2 transition-transform duration-200 group-hover:scale-110">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-contain rounded-full opacity-90"
                    sizes="(max-width: 768px) 64px, 80px"
                  />
                </div>
                
                {/* Category Name */}
                <p className="text-xs md:text-sm font-medium text-gray-800 text-center group-hover:text-[#3a5d1e] transition-colors line-clamp-2">
                  {category.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
