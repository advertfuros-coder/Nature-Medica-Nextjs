'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FiFilter, FiX, FiTag, FiTrendingUp, FiChevronRight } from 'react-icons/fi';
import { ChevronDown } from 'lucide-react';

export default function FilterSidebar({ categories }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilters = {
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || '',
  };

  // Mobile drawer state - single combined drawer
  const [filterDrawer, setFilterDrawer] = useState(false);

  // Lock body scroll when any drawer is open
  useEffect(() => {
    if (filterDrawer) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [filterDrawer]);

  const applyFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);

    // When changing category, clear the search parameter
    if (key === 'category') {
      params.delete('search');
    }

    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page'); // Reset to page 1
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/products');
  };

  // Get current category name
  const currentCategoryName = currentFilters.category
    ? categories.find(c => c.slug === currentFilters.category)?.name
    : 'All Categories';

  // Get current sort name
  const getSortName = () => {
    switch (currentFilters.sort) {
      case 'price-asc': return 'Price: Low to High';
      case 'price-desc': return 'Price: High to Low';
      case 'rating': return 'Highest Rated';
      case 'newest': return 'Newest First';
      case 'bestseller': return 'Best Sellers';
      default: return 'Relevance';
    }
  };

  // Drawer Component
  const Drawer = ({ isOpen, onClose, title, children }) => (
    <>
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-50 animate-fadeIn"
          onClick={onClose}
        />
      )}
      <div
        className={`lg:hidden fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl z-50 transform transition-transform duration-300 max-h-[80vh] flex flex-col ${isOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* ============ MOBILE VIEW ============ */}
      {/* Circular Floating Filter Button */}
      <div className="lg:hidden fixed bottom-20 right-4 z-30">
        <button
          onClick={() => setFilterDrawer(true)}
          className="relative bg-gradient-to-br from-[#4D6F36] to-[#3d5829] text-white w-14 h-14 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <FiFilter className="w-6 h-6" />
          {/* Active Filter Badge */}
          {(currentFilters.category || currentFilters.sort) && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
              {(currentFilters.category ? 1 : 0) + (currentFilters.sort ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* Combined Filter Drawer */}
      <Drawer isOpen={filterDrawer} onClose={() => setFilterDrawer(false)} title="Filters">
        <div className="p-4 space-y-6">
          {/* Clear All Filters */}
          {(currentFilters.category || currentFilters.sort) && (
            <button
              onClick={() => {
                clearFilters();
                setFilterDrawer(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors"
            >
              <FiX className="w-4 h-4" />
              Clear All Filters
            </button>
          )}

          {/* Sort Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FiTrendingUp className="w-5 h-5 text-[#4D6F36]" />
              <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Sort By</h4>
            </div>
            <div className="space-y-1">
              {[
                { value: '', label: 'Relevance' },
                { value: 'price-asc', label: 'Price: Low to High' },
                { value: 'price-desc', label: 'Price: High to Low' },
                { value: 'rating', label: 'Highest Rated' },
                { value: 'newest', label: 'Newest First' },
                { value: 'bestseller', label: 'Best Sellers' },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <span className={`text-sm font-medium ${currentFilters.sort === option.value ? 'text-[#4D6F36]' : 'text-gray-700'}`}>
                    {option.label}
                  </span>
                  <input
                    type="radio"
                    name="sort"
                    checked={currentFilters.sort === option.value}
                    onChange={() => {
                      applyFilter('sort', option.value);
                    }}
                    className="w-4 h-4 text-[#4D6F36] focus:ring-[#4D6F36]"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Category Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FiTag className="w-5 h-5 text-[#4D6F36]" />
              <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Category</h4>
            </div>
            <div className="space-y-1">
              <label className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <span className={`text-sm font-medium ${!currentFilters.category ? 'text-[#4D6F36]' : 'text-gray-700'}`}>
                  All Categories
                </span>
                <input
                  type="radio"
                  name="category"
                  checked={!currentFilters.category}
                  onChange={() => {
                    applyFilter('category', '');
                  }}
                  className="w-4 h-4 text-[#4D6F36] focus:ring-[#4D6F36]"
                />
              </label>
              {categories.map((category) => (
                <label
                  key={category._id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <span className={`text-sm font-medium ${currentFilters.category === category.slug ? 'text-[#4D6F36]' : 'text-gray-700'}`}>
                    {category.name}
                  </span>
                  <input
                    type="radio"
                    name="category"
                    checked={currentFilters.category === category.slug}
                    onChange={() => {
                      applyFilter('category', category.slug);
                    }}
                    className="w-4 h-4 text-[#4D6F36] focus:ring-[#4D6F36]"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Apply Button */}
          <button
            onClick={() => setFilterDrawer(false)}
            className="w-full bg-gradient-to-br from-[#4D6F36] to-[#3d5829] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Apply Filters
          </button>
        </div>
      </Drawer>

      {/* ============ DESKTOP VIEW ============ */}
      <aside className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-4">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-br from-[#4D6F36] to-[#3d5829]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <FiFilter className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Filters</h3>
            </div>
            {(currentFilters.category || currentFilters.sort) && (
              <button
                onClick={clearFilters}
                className="text-white hover:bg-white/20 text-sm font-medium flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all"
              >
                <FiX className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Categories */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                <FiTag className="w-4 h-4 text-[#4D6F36]" />
              </div>
              <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Categories</h4>
            </div>
            <div className="space-y-1">
              <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-green-50 cursor-pointer transition-all group">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${!currentFilters.category ? 'border-[#4D6F36] bg-[#4D6F36]' : 'border-gray-300 group-hover:border-[#4D6F36]'
                  }`}>
                  {!currentFilters.category && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                  )}
                </div>
                <input
                  type="radio"
                  name="category"
                  checked={!currentFilters.category}
                  onChange={() => applyFilter('category', '')}
                  className="sr-only"
                />
                <span className={`text-sm font-medium ${!currentFilters.category ? 'text-[#4D6F36]' : 'text-gray-700 group-hover:text-gray-900'
                  }`}>
                  All Categories
                </span>
              </label>
              {categories.map((category) => (
                <label
                  key={category._id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-green-50 cursor-pointer transition-all group"
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${currentFilters.category === category.slug ? 'border-[#4D6F36] bg-[#4D6F36]' : 'border-gray-300 group-hover:border-[#4D6F36]'
                    }`}>
                    {currentFilters.category === category.slug && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                    )}
                  </div>
                  <input
                    type="radio"
                    name="category"
                    checked={currentFilters.category === category.slug}
                    onChange={() => applyFilter('category', category.slug)}
                    className="sr-only"
                  />
                  <span className={`text-sm font-medium flex-1 ${currentFilters.category === category.slug ? 'text-[#4D6F36]' : 'text-gray-700 group-hover:text-gray-900'
                    }`}>
                    {category.name}
                  </span>
                  <FiChevronRight className={`w-4 h-4 ${currentFilters.category === category.slug ? 'text-[#4D6F36]' : 'text-gray-400 group-hover:text-gray-600'
                    }`} />
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200"></div>

          {/* Sort */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                <FiTrendingUp className="w-4 h-4 text-[#4D6F36]" />
              </div>
              <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Sort By</h4>
            </div>
            <select
              value={currentFilters.sort || ''}
              onChange={(e) => applyFilter('sort', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:border-[#4D6F36] focus:ring-2 focus:ring-[#4D6F36] focus:ring-opacity-20 outline-none transition cursor-pointer font-medium"
            >
              <option value="">Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
              <option value="bestseller">Best Sellers</option>
            </select>
          </div>
        </div>
      </aside>
    </>
  );
}
