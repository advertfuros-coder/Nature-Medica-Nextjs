'use client';

import ProductCard from './ProductCard';
import { useRouter } from 'next/navigation';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function ProductList({ products, currentPage, totalPages, totalProducts }) {
  const router = useRouter();

  const handlePageChange = (page) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', page);
    router.push(`?${params.toString()}`);
  };

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-50 flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-500 mb-6">Try adjusting your filters or search criteria</p>
        <button
          onClick={() => router.push('/products')}
          className="inline-flex items-center gap-2 bg-[#415f2d] text-white px-6 py-3 rounded-lg hover:bg-[#344b24] transition-all font-medium"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Results Header */}
      <div className="bg-white lg:rounded-2xl p-4 lg:shadow-sm lg:border border-gray-100 mb-4 lg:mb-6">
        <div className="flex items-center justify-between">
          <p className="text-sm lg:text-base text-gray-600">
            Showing <span className="font-semibold text-gray-900">{products.length}</span> products
            {totalPages > 1 && (
              <span> (Page {currentPage} of {totalPages})</span>
            )}
          </p>
        </div>
      </div>

      {/* Product Grid - 2 columns on mobile, 3 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6 px-2 lg:px-0 pb-24 lg:pb-0">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 lg:mt-12 flex items-center justify-center gap-2 pb-24 lg:pb-0">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-lg border border-gray-200 hover:border-[#415f2d] hover:bg-[#415f2d] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-lg font-medium transition-all ${currentPage === pageNum
                    ? 'bg-[#415f2d] text-white shadow-md'
                    : 'border border-gray-200 hover:border-[#415f2d] hover:text-[#415f2d]'
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-lg border border-gray-200 hover:border-[#415f2d] hover:bg-[#415f2d] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
