'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function FilterSidebar({ categories, currentFilters }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [minPrice, setMinPrice] = useState(currentFilters.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(currentFilters.maxPrice || '');

  const applyFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    params.delete('page'); // Reset to page 1
    router.push(`?${params.toString()}`);
  };

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams);
    
    if (minPrice) params.set('minPrice', minPrice);
    else params.delete('minPrice');
    
    if (maxPrice) params.set('maxPrice', maxPrice);
    else params.delete('maxPrice');
    
    params.delete('page');
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/products');
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-red-500 hover:text-red-700"
        >
          Clear All
        </button>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Categories</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category._id} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={currentFilters.category === category.slug}
                onChange={() => applyFilter('category', category.slug)}
                className="mr-2"
              />
              <span className="text-sm">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Price Range</h4>
        <div className="space-y-3">
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
          <button
            onClick={applyPriceFilter}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Sort */}
      <div>
        <h4 className="font-semibold mb-3">Sort By</h4>
        <select
          value={currentFilters.sort || ''}
          onChange={(e) => applyFilter('sort', e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
        >
          <option value="">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>
    </div>
  );
}
