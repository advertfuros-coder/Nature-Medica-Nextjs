'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import { ShoppingCart, Zap, Star } from 'lucide-react';
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

  // Prepare Cloudinary image URL with transformation or fallback
  const rawImage = product.images?.[0]?.url;
  const hasCloudinaryImage = rawImage && rawImage.includes('cloudinary.com');
  const publicId = hasCloudinaryImage ? getCloudinaryPublicId(rawImage) : null;
  const imageSrc = hasCloudinaryImage
    ? cloudinaryLoader({ src: publicId, width: 400 })
    : rawImage || '/placeholder.png';

  return (
    <Link 
      href={`/products/${product.slug}`} 
      className="group block h-full"
      prefetch={false}
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
        <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
          <Image
            src={imageError ? "/placeholder.png" : imageSrc}
            alt={product.title}
            width={400}
            height={400}
            quality={80}
            loader={() => imageSrc}
            placeholder="blur"
            blurDataURL="/placeholder.png"
            onError={() => setImageError(true)} // fallback if image fails
            loading="lazy"
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
            priority={false}
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
          <div className="w-full mt-4">
            <div className="w-full gap-2">
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="flex w-full mt-2 border bg-white/90 hover:bg-white text-gray-900 py-2 rounded-lg text-[11px] flex items-center justify-center gap-2 transition-all"
              >
                <ShoppingCart className="w-4 h-4" />
                {adding ? 'Added!' : 'Add Cart'}
              </button>
              <button
                onClick={handleQuickBuy}
                disabled={quickBuying}
                className="flex-1 w-full mt-1 bg-[#415f2d] hover:bg-[#344a24] text-white py-2 rounded-lg text-[11px] flex items-center justify-center gap-2 transition-all"
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
