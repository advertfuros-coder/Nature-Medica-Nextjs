'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import Image from 'next/image';
import { FiShoppingBag, FiZap, FiCheck } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { trackAddToCart } from '@/utils/analytics';

export default function MobileStickyBar({ product = {} }) {
  const [isVisible, setIsVisible] = useState(false);
  const [adding, setAdding] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      // Show only when scrolled past 480px on mobile
      if (window.scrollY > 480) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!product?._id) return null;

  const currentPrice = product.price || 0;
  const currentMRP = product.mrp || currentPrice;
  const imgUrl = product.images?.[0]?.url || '/placeholder.png';

  const handleAddToCart = () => {
    setAdding(true);
    dispatch(addToCart({ product, quantity: 1 }));
    trackAddToCart(product, 1);
    setTimeout(() => setAdding(false), 1200);
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ product, quantity: 1 }));
    trackAddToCart(product, 1);
    router.push('/checkout');
  };

  return (
    <div
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 p-2.5 pb-4 transition-transform duration-300 shadow-xl ${
        isVisible ? 'translate-y-0' : 'translate-y-full pointer-events-none'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Product Minithumb & Price */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#f4f7f2] border border-gray-100 flex-shrink-0">
            <Image
              src={imgUrl}
              alt={product.title || 'Product'}
              fill
              sizes="40px"
              className="object-contain p-0.5"
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-gray-900 truncate leading-tight">
              {product.title}
            </p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-sm font-bold text-gray-900">
                ₹{currentPrice.toLocaleString('en-IN')}
              </span>
              {currentMRP > currentPrice && (
                <span className="text-[11px] text-gray-400 line-through font-medium">
                  ₹{currentMRP.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={adding}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border cursor-pointer ${
              adding
                ? 'bg-[#eef5ec] text-[#2d4e24] border-[#2d4e24]'
                : 'bg-white text-gray-900 border-[#2d4e24] hover:bg-[#eef5ec]'
            }`}
          >
            {adding ? <FiCheck className="w-3.5 h-3.5 text-[#2d4e24]" /> : <FiShoppingBag className="w-3.5 h-3.5 text-[#2d4e24]" />}
            <span>{adding ? 'Added' : 'Add'}</span>
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            className="bg-[#2d4e24] hover:bg-[#223d1b] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs active:scale-95 cursor-pointer"
          >
            <FiZap className="w-3.5 h-3.5 text-amber-300 fill-current" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
