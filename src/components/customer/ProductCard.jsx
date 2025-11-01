'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import { FiShoppingCart, FiHeart, FiStar, FiTruck, FiShield, FiZap } from 'react-icons/fi';
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
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [quickBuying, setQuickBuying] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  const handleQuickBuy = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setQuickBuying(true);
    
    // Add to cart
    dispatch(addToCart({
      product,
      quantity: 1,
      variant: null
    }));
    
    // Wait a bit for cart to update, then redirect to checkout
    setTimeout(() => {
      router.push('/checkout');
    }, 500);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const imageUrl = product.images?.[0]?.url || '/placeholder.png';
  const hasCloudinaryImage = imageUrl.includes('cloudinary.com');

  return (
    <Link 
      href={`/products/${product.slug}`} 
      className="group block h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`bg-white rounded-xl shadow-md transition-transform duration-300 ease-in-out flex flex-col h-full hover:shadow-lg hover:-translate-y-1`}>
        {/* Image Container */}
        <div className="relative w-full aspect-[2/2] overflow-hidden rounded-t-xl bg-gray-50">
          <img
            loader={hasCloudinaryImage && !imageError ? cloudinaryLoader : undefined}
            src={hasCloudinaryImage && !imageError ? getCloudinaryPublicId(imageUrl) : imageUrl}
            alt={product.title}
            className={`w-full h-full object-cover transition-transform duration-700 ease-in-out ${isHovered ? 'scale-105' : 'scale-100'}`}
            onError={() => setImageError(true)}
          />

          {/* Discount Tag */}
          {product.discountPercent > 0 && (
            <div className="absolute top-3 left-3 bg-gradient-to-br from-red-500 to-red-600 text-white px-2 py-0.5 rounded-md text-[11px] font-semibold shadow-md select-none">
              {product.discountPercent}% OFF
            </div>
          )}

          {/* Bestseller Tag */}
          {product.isBestSeller && (
            <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-2 py-0.5 rounded-md text-[11px] font-semibold shadow-md select-none">
              ⭐ Bestseller
            </div>
          )}

          {/* Stock Status Overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-20 rounded-t-xl">
              <div className="text-center px-4">
                <p className="font-semibold text-[11px] text-gray-800 mb-1">Out of Stock</p>
                <p className="text-[11px] text-gray-500">Notify when available</p>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-1 p-4 border-t border-gray-100">
          {/* Brand and Prescription */}
          <div className="flex items-center gap-2 mb-1">
            {product.brand && (
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide truncate">
                {product.brand}
              </span>
            )}
            {product.prescription && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#415f2d] bg-[#415f2d] bg-opacity-10 px-2 py-0.5 rounded select-none">
                <FiShield className="w-3 h-3" />
                Rx
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-medium text-sm text-gray-900 mb- line-clamp-2 leading-snug">
            {product.title}
          </h3>

          {/* Rating */}
          {product.reviewCount > 0 && (
            <div className="flex items-center gap-2 mb-1">
              <div className="flex items-center gap-1 bg-[#415f2d] px-2 py-0.5 rounded-md">
                <FiStar className="w-4 h-4 text-white" />
                <span className="text-[11px] font-semibold text-white">
                  {product.ratingAvg.toFixed(1)}
                </span>
              </div>
              <span className="text-[11px] text-gray-400 font-medium">
                {product.reviewCount.toLocaleString()}+ ratings
              </span>
            </div>
          )}

          {/* Price and Delivery */}
          <div className="mb-2">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold text-gray-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.mrp > product.price && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {/* {product.price >= 999 && (
              <div className="flex items-center gap-1 text-[11px] font-semibold text-green-600 mt-1">
                <FiTruck className="w-4 h-4" />
                Free delivery
              </div>
            )} */}
          </div>

          {/* Buttons */}
          <div className="flex flex-col  gap-2 ">
            <button
              onClick={handleQuickBuy}
              disabled={quickBuying}
              className="flex-1 bg-gradient-to-r from-[#FF8914] to-[#FF6B00] text-white py-2.5 rounded-lg font-semibold text-xs flex items-center justify-center gap-1 shadow-md hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {quickBuying ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <FiZap className="w-4 h-4" />
                  Quick Buy
                </>
              )}
            </button>

            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              className={`flex-1 py-2.5 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
                adding
                  ? 'bg-green-600 text-white shadow-md'
                  : product.stock === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-2 border-[#415f2d] text-[#415f2d] hover:bg-[#415f2d] hover:text-white shadow-md hover:shadow-lg'
              }`}
            >
              {adding ? (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Added!
                </>
              ) : (
                <>
                  <FiShoppingCart className="w-4 h-4" />
                 Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
