'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import { ShoppingCart, Zap, Star, Heart, Leaf, Award } from 'lucide-react';
import { useState } from 'react';

// Custom Cloudinary loader function
const cloudinaryLoader = ({ src, width, quality }) => {
  const params = ['f_auto', 'q_auto', `w_${width}`];
  return `https://res.cloudinary.com/dnhak76jd/image/upload/${params.join(',')}/${src}`;
};

// Extract Cloudinary publicId from a full URL
const getCloudinaryPublicId = (url) => {
  if (!url) return '';
  if (url.includes('cloudinary.com')) {
    const parts = url.split('/upload/');
    if (parts.length > 1) return parts[1].split('?')[0];
  }
  return url;
};

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [quickBuying, setQuickBuying] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    dispatch(addToCart({ product, quantity: 1, variant: null }));
    setTimeout(() => setAdding(false), 1500);
  };

  const handleQuickBuy = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickBuying(true);
    dispatch(addToCart({ product, quantity: 1, variant: null }));
    setTimeout(() => router.push('/checkout'), 500);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    // TODO: Integrate with wishlist API
  };

  // Prepare Cloudinary image URL with transformation or fallback
  const rawImage = product.images?.[0]?.url;
  const hasCloudinaryImage = rawImage && rawImage.includes('cloudinary.com');
  const publicId = hasCloudinaryImage ? getCloudinaryPublicId(rawImage) : null;
  const imageSrc = hasCloudinaryImage
    ? cloudinaryLoader({ src: publicId, width: 400 })
    : rawImage || '/placeholder.png';

  // Calculate discount percentage if not provided
  const discountPercent = product.discountPercent ||
    (product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0);

  // Calculate savings
  const savings = product.mrp > product.price ? product.mrp - product.price : 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block h-full"
      prefetch={false}
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100 hover:border-[#4D6F36]/30">
        {/* Image Container */}
        <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-green-50 to-gray-50">
          <Image
            src={imageError ? "/placeholder.png" : imageSrc}
            alt={product.title}
            width={400}
            height={400}
            quality={80}
            loader={() => imageSrc}
            placeholder="blur"
            blurDataURL="/placeholder.png"
            onError={() => setImageError(true)}
            loading="lazy"
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
            priority={false}
          />

          {/* Badges Container */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            {/* Discount Badge */}
            {discountPercent > 0 && (
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2.5 py-1 rounded-lg text-[9px] font-semibold shadow-md backdrop-blur-sm">
                {discountPercent}% OFF
              </div>
            )}

            <div className="flex-1"></div>

            
          </div>

          {/* Trust Badges */}
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            {product.isOrganic && (
              <div className="bg-green-600/90 backdrop-blur-sm text-white px-2 py-1 rounded text-[9px] font-semisemibold flex items-center gap-1">
                <Leaf className="w-3 h-3" />
                Organic
              </div>
            )}
            {product.isBestSeller && (
              <div className="bg-amber-500/90 backdrop-blur-sm text-white px-2 py-1 rounded text-[9px] font-semisemibold flex items-center gap-1">
                <Award className="w-3 h-3" />
                Bestseller
              </div>
            )}
          </div>

          {/* Quick View Overlay (appears on hover) */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4">
          {/* Category Badge */}
          {product.category?.name && (
            <div className="mb-2">
              <span className="text-[10px] text-[#4D6F36] font-semisemibold uppercase tracking-wide">
                {product.category.name}
              </span>
            </div>
          )}

          {/* Product Title */}
          <h3 className="font-semisemibold text-[13px] text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-[#4D6F36] transition-colors">
            {product.title}
          </h3>

          {/* Rating */}
          {product.reviewCount > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < Math.round(product.ratingAvg)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                      }`}
                  />
                ))}
              </div>
              <span className="text-[11px] text-gray-600 font-medium">
                {product.ratingAvg.toFixed(1)}
              </span>
              <span className="text-[10px] text-gray-400">
                ({product.reviewCount})
              </span>
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Price Section */}
          <div className="mb-3">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text- font-semibold text-gray-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.mrp > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {savings > 0 && (
              <p className="text-[11px] text-green-600 font-semisemibold">
                Save ₹{savings.toLocaleString('en-IN')}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className={`w-full border-2 py-2.5 rounded-xl text-[12px] font-semisemibold flex items-center justify-center gap-2 transition-all ${adding
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 bg-white hover:border-[#4D6F36] hover:bg-green-50 text-gray-900'
                }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {adding ? 'Added to Cart! ✓' : 'Add to Cart'}
            </button>

            {/* Quick Buy Button */}
            <button
              onClick={handleQuickBuy}
              disabled={quickBuying}
              className="w-full bg-[#4D6F36] hover:bg-[#3d5829] text-white py-2.5 rounded-xl text-[12px] font-semisemibold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md disabled:opacity-70"
            >
              <Zap className="w-4 h-4" />
              {quickBuying ? 'Redirecting...' : 'Buy Now'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
