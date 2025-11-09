'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import { ShoppingCart, Zap, Star, Heart } from 'lucide-react';
import { useState } from 'react';

const cloudinaryLoader = ({ src, width, quality }) => {
  const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`];
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${params.join(',')}/${src}`;
};

const getCloudinaryPublicId = (url) => {
  if (!url) return '';
  if (url.includes('cloudinary.com')) {
    const parts = url.split('/upload/');
    if (parts.length > 1) return parts[1].split('?')[0];
  }
  return url;
};

export default function ProductCardGlass({ product }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [quickBuying, setQuickBuying] = useState(false);
  const [imageError, setImageError] = useState(false);

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

  const imageUrl = product.images?.[0]?.url || '/placeholder.png';
  const hasCloudinaryImage = imageUrl.includes('cloudinary.com');

  return (
    <Link 
      href={`/products/${product.slug}`} 
      className="group block h-full"
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
        <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
          <Image
            loader={hasCloudinaryImage && !imageError ? cloudinaryLoader : undefined}
            src={hasCloudinaryImage && !imageError ? getCloudinaryPublicId(imageUrl) : imageUrl}
            alt={product.title}
             width={100}
            height={100}
              quality={50}
  priority={false} 
            className="w-full  h-full object-cover transition-transform duration-700 scale-100"
            onError={() => setImageError(true)}
          />

          {product.discountPercent > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-[10px] font- backdrop-blur-sm">
              {product.discountPercent}% OFF
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 p-4">
          <h3 className="font-medium text-[12px] text-gray-900 mb-2 line-clamp-2 leading-tight">
            {product.title}
          </h3>

          {product.reviewCount > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-[10px] text-gray-600 font-medium">
                {product.ratingAvg.toFixed(1)} ({product.reviewCount})
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-2 mt-auto">
            <span className="text-base font-semibold text-gray-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.mrp > product.price && (
              <span className="text-[11px] text-gray-400 line-through">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Glassmorphism Buttons moved here */}
          <div className="w-full mt-4shadow-2xl">
            <div className="w-full gap-2">
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="flex w-full mt-2 border- bg-white/90 hover:bg-white text-gray-900 py-2 rounded-lg text-[11px] font- flex items-center justify-center gap-2 transition-all "
              >
                <ShoppingCart className="w-4 h-4" />
                {adding ? 'Added!' : 'Add Cart'}
              </button>
              <button
                onClick={handleQuickBuy}
                disabled={quickBuying}
                className="flex-1 w-full mt-1 bg-[#415f2d] hover:bg-[#344a24] text-white py-2 rounded-lg text-[11px] font- flex items-center justify-center gap-2 transition-all "
              >
                <Zap className="w-4 h-4" />
                {quickBuying ? 'Processing' : 'Buy Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
