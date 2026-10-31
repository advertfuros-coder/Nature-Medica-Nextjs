'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import { FiPlus, FiCheck, FiShoppingBag, FiZap } from 'react-icons/fi';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { addToCart } from '@/store/slices/cartSlice';
import { trackAddToCart } from '@/utils/analytics';

export default function FrequentlyBoughtTogether({ product, companions = [] }) {
  const dispatch = useDispatch();
  
  // Default to selecting all companions in the routine
  const [selected, setSelected] = useState(() => 
    (companions && companions.length > 0) ? companions.slice(0, 2).map((c) => c._id) : []
  );
  const [added, setAdded] = useState(false);

  if (!product?._id) return null;

  // Filter companions that are active/selected
  const validCompanions = companions || [];
  const picked = validCompanions.filter((c) => selected.includes(c._id));
  const bundle = [product, ...picked];

  // Base calculation
  const subtotal = bundle.reduce((sum, p) => sum + (p.price || 0), 0);
  const totalMRP = bundle.reduce((sum, p) => sum + (p.mrp || p.price || 0), 0);
  
  // Special Routine Builder bundle bonus: if 2+ items selected, apply extra 10% bundle incentive if no MRP discount
  const baseSavings = Math.max(0, totalMRP - subtotal);
  const extraRoutineDiscount = (bundle.length >= 2 && baseSavings === 0)
    ? Math.round(subtotal * 0.1)
    : 0;
  
  const finalTotal = subtotal - extraRoutineDiscount;
  const totalSavings = baseSavings + extraRoutineDiscount;

  const toggle = (id) => {
    setSelected((prev) => 
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAddAll = () => {
    bundle.forEach((p) => {
      dispatch(addToCart({ product: p, quantity: 1 }));
      trackAddToCart(p, 1);
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const imgOf = (p) => p.images?.[0]?.url || p.featuredImage || '/placeholder.png';

  return (
    <section className="border-t border-gray-100 pt-8 sm:pt-10">
      <div className="mb-5 sm:mb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#eef5ec] text-[#2d4e24] text-[11px] font-bold uppercase tracking-wider border border-[#2d4e24]/20 mb-1.5">
          <Sparkles className="w-3 h-3 text-[#2d4e24]" />
          Recommended Routine
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          Routine Builder — Buy Together & Save
        </h2>
        <p className="text-gray-600 text-xs sm:text-[13px] mt-0.5">
          Formulations engineered for synergistic efficacy. Pair with this complementary essential for enhanced results.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-4 sm:p-6">
        {/* Products Visual Strip */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {/* Main Product Card */}
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-[#f4f7f2] border-2 border-[#2d4e24] flex-shrink-0 shadow-2xs">
              <Image 
                src={imgOf(product)} 
                alt={product.title} 
                fill 
                sizes="96px" 
                className="object-contain p-1.5" 
              />
              <span className="absolute top-1 left-1 bg-[#2d4e24] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                This Item
              </span>
            </div>
            <span className="text-[11px] font-bold text-gray-800 mt-1.5 text-center max-w-[96px] truncate">
              {product.title}
            </span>
            <span className="text-xs font-bold text-[#2d4e24]">
              ₹{(product.price || 0).toLocaleString('en-IN')}
            </span>
          </div>

          {/* Complementary Companion Products */}
          {validCompanions.map((c) => {
            const isOn = selected.includes(c._id);
            return (
              <div key={c._id} className="flex items-center gap-3 sm:gap-4">
                <div className="w-7 h-7 rounded-full bg-[#f4f7f2] border border-gray-200 flex items-center justify-center text-gray-500 font-bold flex-shrink-0">
                  <FiPlus className="w-3.5 h-3.5" />
                </div>

                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => toggle(c._id)}
                    aria-pressed={isOn}
                    aria-label={`${isOn ? 'Remove' : 'Add'} ${c.title}`}
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-[#f4f7f2] border-2 transition-all cursor-pointer flex-shrink-0 group ${
                      isOn 
                        ? 'border-[#2d4e24] shadow-xs ring-2 ring-[#2d4e24]/10' 
                        : 'border-gray-200 opacity-60 hover:opacity-90'
                    }`}
                  >
                    <Image 
                      src={imgOf(c)} 
                      alt={c.title} 
                      fill 
                      sizes="96px" 
                      className="object-contain p-1.5 group-hover:scale-105 transition-transform" 
                    />
                    <div className={`absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                      isOn ? 'bg-[#2d4e24] text-white' : 'border border-gray-300 bg-white'
                    }`}>
                      {isOn && <FiCheck className="w-2.5 h-2.5" />}
                    </div>
                  </button>
                  <span className="text-[11px] font-medium text-gray-700 mt-1.5 text-center max-w-[96px] truncate">
                    {c.title}
                  </span>
                  <span className="text-xs font-bold text-gray-900">
                    ₹{(c.price || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Items Checkbox List */}
        <div className="mt-5 pt-4 border-t border-gray-100">
          <ul className="space-y-2 text-xs text-gray-700">
            <li className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-900">
                <input 
                  type="checkbox" 
                  checked 
                  disabled 
                  className="rounded text-[#2d4e24] focus:ring-[#2d4e24] cursor-not-allowed" 
                />
                <span className="truncate">
                  <span className="font-bold text-[#2d4e24]">Step 1 (Main):</span> {product.title}
                </span>
              </label>
              <span className="font-bold text-gray-900 flex-shrink-0">
                ₹{(product.price || 0).toLocaleString('en-IN')}
              </span>
            </li>

            {validCompanions.map((c, i) => {
              const isOn = selected.includes(c._id);
              return (
                <li key={c._id} className="flex items-center justify-between gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isOn}
                      onChange={() => toggle(c._id)}
                      className="rounded text-[#2d4e24] focus:ring-[#2d4e24] cursor-pointer"
                    />
                    <span className={`truncate ${isOn ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                      <span className="font-semibold text-gray-600">Step {i + 2} (Companion):</span> {c.title}
                    </span>
                  </label>
                  <span className={`font-semibold flex-shrink-0 ${isOn ? 'text-gray-900' : 'text-gray-400'}`}>
                    ₹{(c.price || 0).toLocaleString('en-IN')}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Price & Add All to Cart Bar */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#fbfdfa] -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 p-4 sm:p-5 rounded-b-2xl border-t border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] uppercase tracking-wider font-bold text-gray-500">
                Routine Bundle Total ({bundle.length} items):
              </span>
              {totalSavings > 0 && (
                <span className="text-[10px] font-bold text-[#2d4e24] bg-[#eef5ec] px-2 py-0.5 rounded-full border border-[#2d4e24]/20">
                  Save ₹{totalSavings.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold text-gray-900">
                ₹{finalTotal.toLocaleString('en-IN')}
              </span>
              {totalMRP > finalTotal && (
                <span className="text-xs text-gray-400 line-through font-medium">
                  ₹{totalMRP.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Free Express Delivery Included
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddAll}
            className="bg-[#2d4e24] hover:bg-[#223d1b] text-white px-6 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all cursor-pointer flex-shrink-0"
          >
            {added ? (
              <>
                <FiCheck className="w-4 h-4 text-emerald-300" />
                <span>Routine Added to Bag!</span>
              </>
            ) : (
              <>
                <FiZap className="w-4 h-4 text-amber-300 fill-current" />
                <span>Add {bundle.length} Items to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
