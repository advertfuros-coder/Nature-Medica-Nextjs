'use client';

import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import ProductCard from './ProductCard';
import { Clock, X } from 'lucide-react';

export default function RecentlyViewed({ excludeProductId }) {
    const { recentlyViewed, clearRecentlyViewed, count } = useRecentlyViewed();

    // Filter out the current product if on product detail page
    const filteredProducts = excludeProductId
        ? recentlyViewed.filter(p => p._id !== excludeProductId)
        : recentlyViewed;

    if (filteredProducts.length === 0) {
        return null;
    }

    return (
        <section className="py-12 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900 tracking-tight">
                                Recently Viewed
                            </h2>
                            <p className="text-gray-600 text-sm mt-1">
                                Continue where you left off
                            </p>
                        </div>
                    </div>

                    {count > 0 && (
                        <button
                            onClick={clearRecentlyViewed}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors group"
                        >
                            <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                            Clear All
                        </button>
                    )}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredProducts.slice(0, 5).map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>

                {/* View All Link */}
                {filteredProducts.length > 5 && (
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => {
                                // Could navigate to a dedicated recently viewed page
                                console.log('View all recently viewed');
                            }}
                            className="text-[#3a5d1e] hover:text-[#2d4818] font-medium text-sm inline-flex items-center gap-2 group"
                        >
                            View All {count} Products
                            <svg
                                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
