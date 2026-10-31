'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import { FiPlus, FiCheck } from 'react-icons/fi';
import { addToCart } from '@/store/slices/cartSlice';
import { trackAddToCart } from '@/utils/analytics';

// Low-price add-on offered in the cart, pulled from the database
// (cheapest in-stock product, or one with a special bumpPrice).
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
    // Refetch only when the set of cart products changes
  }, [ownedIds]);

  if (!offer) return null;

  const inCart = items.some((item) => item.product._id === offer._id);
  const hasSpecialPrice = offer.offerPrice < offer.price;
  // Only mention free shipping when this add-on actually gets the cart there
  const unlocksShipping = shortBy > 0 && offer.offerPrice >= shortBy;

  const handleAdd = () => {
    const product = hasSpecialPrice ? { ...offer, price: offer.offerPrice } : offer;
    dispatch(addToCart({ product, quantity: 1, variant: hasSpecialPrice ? 'bump' : undefined }));
    trackAddToCart(product, 1);
  };

  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 shadow-xs border border-dashed border-amber-300 flex items-center gap-3">
      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#f4f7f2] border border-gray-100 flex-shrink-0">
        <Image
          src={offer.images?.[0]?.url || '/placeholder.png'}
          alt={offer.title}
          fill
          sizes="56px"
          className="object-contain p-1"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wide text-amber-800">
          {unlocksShipping ? 'Add this & unlock FREE shipping' : 'Add to your order'}
        </p>
        <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{offer.title}</p>
        <p className="text-xs">
          <span className="font-bold text-[#2d4e24]">₹{offer.offerPrice.toLocaleString('en-IN')}</span>{' '}
          {(offer.mrp || offer.price) > offer.offerPrice && (
            <span className="text-gray-400 line-through">
              ₹{(offer.mrp || offer.price).toLocaleString('en-IN')}
            </span>
          )}
        </p>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={inCart}
        className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 flex-shrink-0 transition-all cursor-pointer ${
          inCart
            ? 'bg-[#eef5ec] text-[#2d4e24] border border-[#2d4e24]'
            : 'bg-[#2d4e24] hover:bg-[#223d1b] text-white active:scale-95'
        }`}
      >
        {inCart ? <FiCheck className="w-3.5 h-3.5" /> : <FiPlus className="w-3.5 h-3.5" />}
        {inCart ? 'Added' : 'Add'}
      </button>
    </div>
  );
}
