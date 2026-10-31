'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiX, FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { closeDrawer, removeFromCart, updateQuantity } from '@/store/slices/cartSlice';
import { paidSubtotal } from '@/lib/giftTiers';
import GiftProgress from './GiftProgress';

// Slide-in cart opened whenever the customer adds an item
export default function CartDrawer() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { items = [], drawerOpen = false, totalPrice = 0 } = useSelector((state) => state.cart || {});

  // The cart and checkout pages already show the cart
  const onCartPage = pathname?.startsWith('/cart') || pathname?.startsWith('/checkout');
  const open = drawerOpen && !onCartPage;

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

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Shopping bag">
      <div className="absolute inset-0 bg-black/40" onClick={close} />

      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-[slideIn_0.25s_ease-out]">
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <FiShoppingBag className="w-4 h-4 text-[#2d4e24]" />
            Your Bag ({items.reduce((n, i) => n + i.quantity, 0)})
          </h2>
          <button type="button" onClick={close} aria-label="Close bag" className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer">
            <FiX className="w-5 h-5" />
          </button>
        </header>

        <div className="px-4 pt-3">
          <GiftProgress subtotal={subtotal} />
        </div>

        <ul className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {items.map((item) => {
            const isGift = item.variant === 'gift';
            const price = item.price ?? item.product.price;
            return (
              <li key={`${item.product._id}-${item.variant || ''}`} className="flex gap-3 p-2.5 rounded-xl border border-gray-100">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#f4f7f2] flex-shrink-0">
                  <Image
                    src={item.product.images?.[0]?.url || '/placeholder.png'}
                    alt={item.product.title}
                    fill
                    sizes="64px"
                    className="object-contain p-1"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-gray-900 line-clamp-2">{item.product.title}</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">
                    {isGift ? <span className="text-[#2d4e24]">FREE GIFT</span> : `₹${(price * item.quantity).toLocaleString('en-IN')}`}
                  </p>
                  {!isGift && (
                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          disabled={item.quantity <= 1}
                          onClick={() => dispatch(updateQuantity({ productId: item.product._id, variant: item.variant, quantity: item.quantity - 1 }))}
                          className="p-1.5 disabled:opacity-40 cursor-pointer"
                        >
                          <FiMinus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => dispatch(updateQuantity({ productId: item.product._id, variant: item.variant, quantity: item.quantity + 1 }))}
                          className="p-1.5 cursor-pointer"
                        >
                          <FiPlus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        aria-label="Remove item"
                        onClick={() => dispatch(removeFromCart({ productId: item.product._id, variant: item.variant }))}
                        className="p-1.5 text-gray-400 hover:text-red-600 cursor-pointer"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <footer className="border-t border-gray-100 p-4 space-y-2.5">
          <div className="flex justify-between text-sm font-bold text-gray-900">
            <span>Subtotal</span>
            <span>₹{totalPrice.toLocaleString('en-IN')}</span>
          </div>
          <Link
            href="/checkout"
            onClick={close}
            className="block text-center bg-[#2d4e24] hover:bg-[#223d1b] text-white py-3 rounded-xl text-sm font-bold transition-colors"
          >
            Checkout
          </Link>
          <Link
            href="/cart"
            onClick={close}
            className="block text-center border-2 border-[#2d4e24] text-[#2d4e24] py-2.5 rounded-xl text-sm font-bold hover:bg-[#eef5ec] transition-colors"
          >
            View Full Bag
          </Link>
        </footer>
      </aside>

      <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
    </div>
  );
}
