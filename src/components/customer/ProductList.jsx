'use client';

import ProductCard from './ProductCard';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function ProductList({ products, currentPage, totalPages }) {
  const searchParams = useSearchParams();

  const buildPageUrl = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    return `?${params.toString()}`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          Showing {products.length} products
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No products found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {currentPage > 1 && (
                <Link
                  href={buildPageUrl(currentPage - 1)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Previous
                </Link>
              )}
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Link
                  key={page}
                  href={buildPageUrl(page)}
                  className={`px-4 py-2 border rounded ${
                    page === currentPage
                      ? 'bg-green-600 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {page}
                </Link>
              ))}

              {currentPage < totalPages && (
                <Link
                  href={buildPageUrl(currentPage + 1)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Next
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
