'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiX, FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiCheck, FiZap } from 'react-icons/fi';
import { closeDrawer, addToCart, removeFromCart, updateQuantity } from '@/store/slices/cartSlice';
import { paidSubtotal } from '@/lib/giftTiers';
import { trackAddToCart } from '@/utils/analytics';
import GiftProgress from './GiftProgress';

// Slide-in cart opened whenever the customer adds an item
// Features "The McDonald's Fries" 1-Click Cart Bump Upsell
export default function CartDrawer() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { items = [], drawerOpen = false, totalPrice = 0 } = useSelector((state) => state.cart || {});

  // The cart and checkout pages already show the cart
  const onCartPage = pathname?.startsWith('/cart') || pathname?.startsWith('/checkout');
  const open = drawerOpen && !onCartPage;

  // "The McDonald's Fries" Cart Bump Offer state
  const [bumpOffer, setBumpOffer] = useState(null);
  const [bumpLoading, setBumpLoading] = useState(false);

  // List of non-bump items currently in cart to exclude from bump offers
  const ownedNonBumpIds = items
    .filter((item) => item.variant !== 'bump')
    .map((item) => item.product._id)
    .join(',');

  // Fetch the McDonald's Fries Cart Bump offer
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setBumpLoading(true);

    fetch(`/api/products/bump?exclude=${ownedNonBumpIds}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setBumpOffer(data.product || null);
          setBumpLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setBumpLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, ownedNonBumpIds]);

  useEffect(() => {
    if (onCartPage && drawerOpen) dispatch(closeDrawer());
  }, [onCartPage, drawerOpen, dispatch]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && dispatch(closeDrawer());
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, dispatch]);

  if (!open) return null;

  const close = () => dispatch(closeDrawer());
  const subtotal = paidSubtotal(items);

  // Check if current bumpOffer is already in the cart
  const bumpInCart = bumpOffer
    ? items.find((item) => item.product._id === bumpOffer._id && item.variant === 'bump')
    : null;

  // 1-Click Toggle for "The McDonald's Fries" Cart Bump
  const handleToggleBump = () => {
    if (!bumpOffer) return;

    if (bumpInCart) {
      // Uncheck / Remove from cart
      dispatch(removeFromCart({ productId: bumpOffer._id, variant: 'bump' }));
    } else {
      // 1-Click Add to cart at special bump price
      const product = {
        ...bumpOffer,
        price: bumpOffer.offerPrice || bumpOffer.price,
      };
      dispatch(addToCart({ product, quantity: 1, variant: 'bump' }));
      trackAddToCart(product, 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Shopping bag">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs transition-opacity" onClick={close} />

      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-[slideIn_0.25s_ease-out]">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-[#fbfdfa]">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <FiShoppingBag className="w-4 h-4 text-[#2d4e24]" />
            Your Bag ({items.reduce((n, i) => n + i.quantity, 0)})
          </h2>
          <button 
            type="button" 
            onClick={close} 
            aria-label="Close bag" 
            className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </header>

        {/* Free Gift / Shipping Progress Bar */}
        <div className="px-4 pt-3">
          <GiftProgress subtotal={subtotal} />
        </div>

        {/* Items List */}
        <ul className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {items.length === 0 ? (
            <div className="py-12 text-center text-gray-500 text-xs">
              <p className="font-semibold text-gray-700 mb-1">Your bag is currently empty.</p>
              <p>Add your favorite Ayurvedic formulation to unlock exclusive deals!</p>
            </div>
          ) : (
            items.map((item) => {
              const isGift = item.variant === 'gift';
              const isBump = item.variant === 'bump';
              const price = item.price ?? item.product.price;
              return (
                <li 
                  key={`${item.product._id}-${item.variant || ''}`} 
                  className={`flex gap-3 p-2.5 rounded-xl border transition-all ${
                    isBump 
                      ? 'bg-[#fbfdfa] border-emerald-200/90 shadow-2xs' 
                      : isGift 
                      ? 'bg-amber-50/50 border-amber-200' 
                      : 'border-gray-100 bg-white'
                  }`}
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#f4f7f2] flex-shrink-0 border border-gray-100">
                    <Image
                      src={item.product.images?.[0]?.url || item.product.featuredImage || '/placeholder.png'}
                      alt={item.product.title}
                      fill
                      sizes="64px"
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-xs font-semibold text-gray-900 line-clamp-1">{item.product.title}</p>
                      {isBump && (
                        <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-[#2d4e24] px-1.5 py-0.2 rounded border border-emerald-300">
                          ⚡ Bump Deal
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-sm font-bold text-gray-900">
                        {isGift ? (
                          <span className="text-[#2d4e24]">FREE GIFT</span>
                        ) : (
                          `₹${(price * item.quantity).toLocaleString('en-IN')}`
                        )}
                      </p>
                      {isGift && (
                        <button
                          type="button"
                          aria-label="Remove item"
                          onClick={() => dispatch(removeFromCart({ productId: item.product?._id || item.product?.slug, variant: item.variant }))}
                          className="p-1 text-gray-300 hover:text-red-500 cursor-pointer transition-colors"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {!isGift && (
                      <div className="flex items-center justify-between mt-1.5">
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            disabled={item.quantity <= 1}
                            onClick={() => dispatch(updateQuantity({ productId: item.product._id, variant: item.variant, quantity: item.quantity - 1 }))}
                            className="p-1.5 disabled:opacity-40 cursor-pointer hover:bg-gray-50"
                          >
                            <FiMinus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold">{item.quantity}</span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => dispatch(updateQuantity({ productId: item.product._id, variant: item.variant, quantity: item.quantity + 1 }))}
                            className="p-1.5 cursor-pointer hover:bg-gray-50"
                          >
                            <FiPlus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          type="button"
                          aria-label="Remove item"
                          onClick={() => dispatch(removeFromCart({ productId: item.product._id, variant: item.variant }))}
                          className="p-1.5 text-gray-400 hover:text-red-600 cursor-pointer transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              );
            })
          )}
        </ul>

        {/* ─────────────────────────────────────────────────────────────
            "THE MCDONALD'S FRIES" CART BUMP 1-CLICK UPSELL
            Appears right above subtotal/checkout whenever cart has items
           ───────────────────────────────────────────────────────────── */}
        {items.length > 0 && bumpOffer && (
          <div className="px-4 py-2 bg-gradient-to-b from-white to-[#FAF8F5] border-t border-dashed border-amber-300/80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-300 inline-flex items-center gap-1">
                Nature Medica 1-Click Deal
              </span>
              <span className="text-[10px] font-bold text-[#2d4e24] bg-[#eef5ec] px-1.5 py-0.5 rounded border border-[#2d4e24]/15">
                Save {bumpOffer.discountPercent || 50}%
              </span>
            </div>

            <label 
              className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer select-none group ${
                bumpInCart 
                  ? 'bg-[#eef5ec]/70 border-[#2d4e24] shadow-xs' 
                  : 'bg-white border-amber-200 hover:border-[#2d4e24]/60 hover:bg-amber-50/30'
              }`}
            >
              {/* Checkbox */}
              <div className="relative flex items-center flex-shrink-0">
                <input
                  type="checkbox"
                  checked={Boolean(bumpInCart)}
                  onChange={handleToggleBump}
                  className="w-4 h-4 rounded text-[#2d4e24] focus:ring-[#2d4e24] border-gray-300 cursor-pointer"
                />
              </div>

              {/* Product Thumbnail */}
              <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-[#f4f7f2] border border-gray-100 flex-shrink-0">
                <Image
                  src={bumpOffer.images?.[0]?.url || bumpOffer.featuredImage || '/placeholder.png'}
                  alt={bumpOffer.title}
                  fill
                  sizes="44px"
                  className="object-contain p-1"
                />
              </div>

              {/* Copy & Pricing */}
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-gray-900 leading-tight group-hover:text-[#2d4e24] transition-colors">
                  {bumpOffer.checkboxText || `Add ${bumpOffer.shortTitle || bumpOffer.title} for just ₹${bumpOffer.offerPrice} (Save ${bumpOffer.discountPercent}%) — 1 Click Add`}
                </p>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-xs font-black text-[#2d4e24]">
                    ₹{bumpOffer.offerPrice}
                  </span>
                  {(bumpOffer.mrp || bumpOffer.price) > bumpOffer.offerPrice && (
                    <span className="text-[10px] text-gray-400 line-through">
                      ₹{bumpOffer.mrp || bumpOffer.price}
                    </span>
                  )}
                  <span className="text-[10px] font-semibold text-emerald-700 ml-auto">
                    {bumpInCart ? '✓ Added' : '+ 1-Click Add'}
                  </span>
                </div>
              </div>
            </label>
          </div>
        )}

        {/* Footer */}
        <footer className="border-t border-gray-100 p-4 space-y-2.5 bg-white">
          <div className="flex justify-between text-sm font-bold text-gray-900">
            <span>Subtotal</span>
            <span>₹{totalPrice.toLocaleString('en-IN')}</span>
          </div>

          {/* Prepaid UPI nudge teaser */}
          <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[#2d4e24] text-[10px] flex items-center gap-1.5 font-semibold">
            <span className="text-amber-600 font-bold">⚡</span>
            <span>Pay Online / UPI at checkout: <strong>Extra ₹50 OFF + Free Gift</strong></span>
          </div>

          <Link
            href="/checkout"
            onClick={close}
            className="block text-center bg-[#2d4e24] hover:bg-[#223d1b] text-white py-3 rounded-xl text-sm font-bold shadow-xs active:scale-[0.99] transition-all"
          >
            Proceed to Checkout
          </Link>
          <Link
            href="/cart"
            onClick={close}
            className="block text-center border border-[#2d4e24]/30 text-[#2d4e24] py-2 rounded-xl text-xs font-bold hover:bg-[#eef5ec] transition-colors"
          >
            View Full Cart Details
          </Link>
        </footer>
      </aside>

      <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
    </div>
  );
}
