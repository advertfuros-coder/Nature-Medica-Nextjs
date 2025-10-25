'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import { ShoppingCart, Star, Heart, Award, Truck } from 'lucide-react';
import { useState } from 'react';

// Cloudinary loader
const cloudinaryLoader = ({ src, width, quality }) => {
  const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`];
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${params.join(',')}/${src}`;
};

const getCloudinaryPublicId = (url) => {
  if (!url) return '';
  if (url.includes('cloudinary.com')) {
    const parts = url.split('/upload/');
    if (parts.length > 1) {
      return parts[1].split('?')[0];
    }
  }
  return url;
};

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const [adding, setAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setAdding(true);
    dispatch(addToCart({
      product,
      quantity: 1,
      variant: null
    }));
    
    setTimeout(() => setAdding(false), 1500);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const imageUrl = product.images?.[0]?.url || '/placeholder.png';
  const hasCloudinaryImage = imageUrl.includes('cloudinary.com');

  return (
    <Link href={`/products/${product.slug}`} className="group block h-full">
      <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-gray-100 hover:border-green-300 h-full flex flex-col">
        {/* Full Width/Height Image Container */}
        <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
          <img
            loader={hasCloudinaryImage && !imageError ? cloudinaryLoader : undefined}
            src={hasCloudinaryImage && !imageError ? getCloudinaryPublicId(imageUrl) : imageUrl}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImageError(true)}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Badges Container */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 z-10">
            <div className="flex flex-col gap-2">
              {product.discountPercent > 0 && (
                <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold shadow-lg">
                  {product.discountPercent}% OFF
                </span>
              )}
              {product.isBestSeller && (
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  Best
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              className="bg-white/95 backdrop-blur-sm p-2 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95"
              aria-label="Add to wishlist"
            >
              <Heart 
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                  isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
                }`}
              />
            </button>
          </div>

          {/* Out of Stock Overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-20">
              <span className="bg-gray-800 text-white px-6 py-3 rounded-lg font-bold text-sm sm:text-base">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="p-3 sm:p-4 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="font-bold text-sm sm:text-base text-gray-800 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors min-h-[2.5rem]">
            {product.title}
          </h3>

          {/* Brand (if available) */}
          {product.brand && (
            <p className="text-xs text-gray-500 mb-2 font-medium">
              {product.brand}
            </p>
          )}

          {/* Rating */}
          {product.reviewCount > 0 && (
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md">
                <Star className="w-3.5 h-3.5 fill-green-500 text-green-500" />
                <span className="text-xs sm:text-sm font-bold text-gray-800">
                  {product.ratingAvg.toFixed(1)}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                ({product.reviewCount.toLocaleString()})
              </span>
            </div>
          )}

          {/* Features/Benefits */}
          {product.prescription && (
            <div className="flex items-center gap-1.5 text-xs text-green-600 mb-2 bg-green-50 px-2 py-1 rounded-md w-fit">
              <Award className="w-3 h-3" />
              <span className="font-semibold">Rx Required</span>
            </div>
          )}

          {/* Price Section */}
          <div className="mt-auto">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-xl sm:text-2xl font-bold text-green-600">
                ₹{product.price.toLocaleString()}
              </span>
              {product.mrp > product.price && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.mrp.toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Savings Badge */}
            {product.mrp > product.price && (
              <p className="text-xs text-green-600 font-semibold mb-2">
                Save ₹{(product.mrp - product.price).toLocaleString()}
              </p>
            )}

            {/* Free Delivery Badge */}
            {product.price >= 999 && (
              <div className="flex items-center gap-1.5 text-xs text-green-600 mb-3 bg-green-50 px-2 py-1.5 rounded-md">
                <Truck className="w-3.5 h-3.5" />
                <span className="font-semibold">Free Delivery</span>
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              className={`w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95 ${
                adding
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white scale-95'
                  : product.stock === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
              }`}
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              {adding ? (
                <>
                  <span>Added!</span>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </>
              ) : product.stock === 0 ? (
                'Out of Stock'
              ) : (
                'Add to Cart'
              )}
            </button>
          </div>
        </div>

        {/* Hover Border Effect */}
        <div className="absolute inset-0 border-2 border-green-500 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      </div>
    </Link>
  );
}
