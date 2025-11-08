"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CategorySection({ categories }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 lg:gap-8">
      {categories.map((category, index) => (
        <Link
          key={category._id}
          href={`/products?category=${category.slug}`}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          className="group"
        >
          <div className="bg-white  transition-all duration-300 p-4 md:p-6 text-center transform hover:scale-105">
            {/* Category Name */}
            <h3 className="font-semibold text-xs md:text-sm text-center mx-auto text-gray-800 group-hover:text-green-600 transition-colors duration-300 line-clamp-2">
              {category.name}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
