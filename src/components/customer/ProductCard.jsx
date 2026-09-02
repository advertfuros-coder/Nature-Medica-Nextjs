'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import { Heart, Check, ShoppingBag, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { trackAddToCart } from '@/lib/gtm';
import { useWishlist } from '@/hooks/useWishlist';

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
  const [imageError, setImageError] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product?._id);

  if (!product) return null;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (adding) return;

    setAdding(true);
    dispatch(addToCart({ product, quantity: 1, variant: null }));

    // Track add to cart event in GTM
    trackAddToCart(product, 1, null);

    setTimeout(() => setAdding(false), 1400);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const result = await toggleWishlist(product);

    if (result.success) {
      setToast({
        show: true,
        message: result.message,
        type: 'success',
      });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 2000);
    } else {
      setToast({
        show: true,
        message: result.message,
        type: 'error',
      });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    }
  };

  // Prepare Cloudinary image URL with transformation or fallback
  const rawImage = product.images?.[0]?.url || product.image;
  const hasCloudinaryImage = rawImage && rawImage.includes('cloudinary.com');
  const publicId = hasCloudinaryImage ? getCloudinaryPublicId(rawImage) : null;
  const imageSrc = hasCloudinaryImage
    ? cloudinaryLoader({ src: publicId, width: 600 })
    : rawImage || '/placeholder.png';

  // Calculate discount percentage
  const discountPercent =
    product.discountPercent ||
    (product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0);

  // Subtitle / category / short description
  const subtitle =
    product.shortDescription ||
    product.category?.name ||
    product.brand ||
    'Ayurvedic Formulation';

  return (
    <Link
      href={`/products/${product.slug || product._id}`}
      className="group block h-full select-none"
      prefetch={false}
    >
      <div className="flex flex-col h-full">
        
        {/* =========================================
            IMAGE CONTAINER (D'you Rounded Box Style)
           ========================================= */}
        <div className="relative w-full aspect-[4/5] rounded-3xl sm:rounded-[28px] overflow-hidden bg-[#f4f7f2] shadow-xs group-hover:shadow-md transition-all duration-500">
          
          {/* Main Product Image */}
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src={imageError ? '/placeholder.png' : imageSrc}
              alt={product.title || 'Product'}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              quality={85}
              loader={() => imageSrc}
              placeholder="blur"
              blurDataURL="/placeholder.png"
              onError={() => setImageError(true)}
              loading="lazy"
              className="object-cover w-full h-full transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>

   
          {/* Toast Notification inside card */}
          {toast.show && (
            <div
              className={`absolute top-4 left-1/2 transform -translate-x-1/2 px-3.5 py-1.5 rounded-full shadow-lg z-30 animate-in fade-in zoom-in-95 duration-200 ${
                toast.type === 'success' ? 'bg-[#2d4e24]' : 'bg-rose-600'
              } text-white text-[11px] font-bold`}
            >
              {toast.message}
            </div>
          )}

          {/* Floating 'Add to Bag' Button (Exact D'you Style at Bottom-Right) */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={adding}
            className={`absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20 px-4 sm:px-5 py-2 rounded-full font-bold text-xs sm:text-[13px] tracking-tight shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 flex items-center gap-1.5 cursor-pointer ${
              adding
                ? 'bg-[#2d4e24] text-white'
                : 'bg-white text-[#2d4e24] hover:bg-[#2d4e24] hover:text-white border border-gray-100'
            }`}
          >
            {adding ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Added</span>
              </>
            ) : (
              <span>Add to Bag</span>
            )}
          </button>
        </div>


        {/* =========================================
            BOTTOM PRODUCT DETAILS
           ========================================= */}
        <div className="pt-3.5 pb-1 px-1 space-y-1">
          {/* Main Title (Personality style in brand color) */}
          <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-[#2d4e24] group-hover:text-[#1e3617] transition-colors line-clamp-2 leading-snug">
            {product.title}
          </h3>

          {/* Subtitle & Price Row */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            {/* Description / Category */}
            <p className="text-[10px] sm:text-xs font-semibold tracking-wider text-gray-500 uppercase truncate">
              {subtitle}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-1.5 flex-shrink-0 text-right">
              <span className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">
                ₹{Number(product.price || 0).toLocaleString('en-IN')}
              </span>
              {product.mrp > product.price && (
                <span className="text-xs text-gray-400 line-through font-medium">
                  ₹{Number(product.mrp).toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>
        </div>

      </div>
    </Link>
  );
}

