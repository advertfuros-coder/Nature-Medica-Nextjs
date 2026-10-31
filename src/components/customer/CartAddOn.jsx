'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import { FiCheck } from 'react-icons/fi';
import { addToCart, removeFromCart } from '@/store/slices/cartSlice';
import { trackAddToCart } from '@/utils/analytics';

// "The McDonald's Fries" 1-Click Cart Bump Component (Used on Cart page & drawers)
export default function CartAddOn({ items = [], shortBy = 0 }) {
  const dispatch = useDispatch();
  const [offer, setOffer] = useState(null);

  const ownedIds = items
    .filter((item) => item.variant !== 'bump')
    .map((item) => item.product._id)
    .join(',');

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/products/bump?exclude=${ownedIds}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setOffer(data.product || null);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [ownedIds]);

  if (!offer) return null;

  const inCart = items.some((item) => item.product._id === offer._id && item.variant === 'bump');
  const hasSpecialPrice = offer.offerPrice < offer.price;
  const unlocksShipping = shortBy > 0 && offer.offerPrice >= shortBy;

  const handleToggle = () => {
    if (inCart) {
      dispatch(removeFromCart({ productId: offer._id, variant: 'bump' }));
    } else {
      const product = hasSpecialPrice ? { ...offer, price: offer.offerPrice } : offer;
      dispatch(addToCart({ product, quantity: 1, variant: 'bump' }));
      trackAddToCart(product, 1);
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-50/70 to-emerald-50/40 rounded-2xl p-3.5 sm:p-4 mb-4 shadow-xs border border-dashed border-amber-300">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-300 inline-flex items-center gap-1">
          Nature Medica Special • 1-Click Upsell
        </span>
        <span className="text-[10px] font-bold text-[#2d4e24] bg-[#eef5ec] px-2 py-0.5 rounded border border-[#2d4e24]/15">
          Save {offer.discountPercent || 50}%
        </span>
      </div>

      <label className="flex items-center gap-3 cursor-pointer select-none group">
        <div className="relative flex items-center flex-shrink-0">
          <input
            type="checkbox"
            checked={inCart}
            onChange={handleToggle}
            className="w-4 h-4 rounded text-[#2d4e24] focus:ring-[#2d4e24] border-gray-300 cursor-pointer"
          />
        </div>

        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-white border border-gray-100 flex-shrink-0 shadow-2xs">
          <Image
            src={offer.images?.[0]?.url || offer.featuredImage || '/placeholder.png'}
            alt={offer.title}
            fill
            sizes="56px"
            className="object-contain p-1"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wide text-amber-800">
            {unlocksShipping ? 'Add this & unlock FREE shipping' : 'Exclusive Cart Bump Deal'}
          </p>
          <p className="text-xs sm:text-[13px] font-bold text-gray-900 leading-snug group-hover:text-[#2d4e24] transition-colors">
            {offer.checkboxText || `Add ${offer.shortTitle || offer.title} for just ₹${offer.offerPrice} (Save ${offer.discountPercent}%) — 1 Click Add`}
          </p>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-sm font-extrabold text-[#2d4e24]">
              ₹{offer.offerPrice.toLocaleString('en-IN')}
            </span>
            {(offer.mrp || offer.price) > offer.offerPrice && (
              <span className="text-xs text-gray-400 line-through font-medium">
                ₹{(offer.mrp || offer.price).toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-[11px] font-semibold text-emerald-700 ml-auto flex items-center gap-1">
              {inCart ? (
                <>
                  <FiCheck className="w-3.5 h-3.5" /> Added to Bag
                </>
              ) : (
                '+ 1-Click Add'
              )}
            </span>
          </div>
        </div>
      </label>
    </div>
  );
}
