'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiChevronRight, FiGrid } from 'react-icons/fi';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories?level=0');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      const res = await fetch(`/api/categories?parent=${categoryId}`);
      const data = await res.json();
      if (data.success) {
        setSubcategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const handleCategoryHover = async (category) => {
    setSelectedCategory(category);
    if (category.subcategoryCount > 0) {
      await fetchSubcategories(category._id);
    } else {
      setSubcategories([]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#3a5d1e] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <FiGrid className="w-8 h-8 text-[#3a5d1e]" />
            Shop by Category
          </h1>
          <p className="text-gray-600">Browse our complete range of natural wellness products</p>
        </div>

        {/* Flipkart-style Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <div
              key={category._id}
              onMouseEnter={() => handleCategoryHover(category)}
              className="relative group"
            >
              <Link href={`/category/${category.slug}`}>
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#3a5d1e] cursor-pointer">
                  {/* Icon/Emoji */}
                  <div className="text-5xl mb-3 text-center">
                    {category.icon || '📦'}
                  </div>
                  
                  {/* Category Name */}
                  <h3 className="text-sm font-semibold text-gray-900 text-center mb-2">
                    {category.name}
                  </h3>
                  
                  {/* Subcategory Count */}
                  {category.subcategoryCount > 0 && (
                    <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
                      {category.subcategoryCount} items
                      <FiChevronRight className="w-3 h-3" />
                    </p>
                  )}
                </div>
              </Link>

              {/* Hover Dropdown for Subcategories */}
              {selectedCategory?._id === category._id && subcategories.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50 animate-fadeIn">
                  <h4 className="font-bold text-gray-900 mb-3 text-sm">{category.name}</h4>
                  <ul className="space-y-2">
                    {subcategories.map((subcat) => (
                      <li key={subcat._id}>
                        <Link
                          href={`/category/${category.slug}/${subcat.slug}`}
                          className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#3a5d1e] hover:bg-green-50 p-2 rounded-lg transition-colors"
                        >
                          <span className="text-lg">{subcat.icon}</span>
                          <span>{subcat.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
