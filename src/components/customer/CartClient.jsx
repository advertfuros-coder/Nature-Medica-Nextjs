'use client';

import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, applyCoupon, removeCoupon } from '@/store/slices/cartSlice';
import Link from 'next/link';
import { FiTrash2, FiShoppingBag, FiX, FiTag, FiArrowLeft, FiLock, FiMinus, FiPlus, FiTruck, FiShield, FiRefreshCw, FiZap } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import CartAddOn from './CartAddOn';
import GiftProgress from './GiftProgress';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/giftTiers';
import { trackRemoveFromCart, trackViewCart, trackBeginCheckout } from '@/utils/analytics';

export default function CartClient() {
    const dispatch = useDispatch();

    const cartState = useSelector((state) => state.cart || {});
    const {
        items = [],
        total = 0,
        totalPrice = 0,
        discount = 0,
        couponCode = null
    } = cartState;

    const cartTotal = totalPrice || total;

    const [couponInput, setCouponInput] = useState('');
    const [couponError, setCouponError] = useState('');
    const [loading, setLoading] = useState(false);
    // The cart lives in localStorage, so render a neutral shell until the client has mounted
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const handleUpdateQuantity = (productId, variant, quantity) => {
        if (quantity < 1) return;
        dispatch(updateQuantity({ productId, variant, quantity }));
    };

    const handleRemove = (productId, variant) => {
        // Find the item to get product details for tracking
        const itemToRemove = items.find(item =>
            item.product._id === productId && item.variant === variant
        );

        if (itemToRemove) {
            // Track remove from cart event
            trackRemoveFromCart(itemToRemove.product, itemToRemove.quantity);
        }

        dispatch(removeFromCart({ productId, variant }));
    };

    // Track view_cart event when cart is loaded with items
    useEffect(() => {
        if (items.length > 0) {
            trackViewCart(items.map(item => ({ ...item.product, quantity: item.quantity })), cartTotal);
        }
    }, []); // Only run on mount

    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) return;

        setLoading(true);
        setCouponError('');

        try {
            const res = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: couponInput.toUpperCase(),
                    orderValue: cartTotal
                })
            });

            const data = await res.json();

            if (res.ok) {
                dispatch(applyCoupon({
                    code: couponInput.toUpperCase(),
                    discount: data.discount
                }));
                setCouponInput('');
            } else {
                setCouponError(data.error || 'Invalid coupon code');
            }
        } catch (error) {
            setCouponError('Failed to apply coupon');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        dispatch(removeCoupon());
        setCouponError('');
    };

    if (!mounted) {
        return <div className="min-h-[60vh] bg-white" aria-busy="true" />;
    }

    if (items.length === 0) {
        return (
            <div className="min-h-[30vh] flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 mx-auto my-2 rounded-full bg-gray-50 flex items-center justify-center">
                        <FiShoppingBag className="text-5xl text-gray-300" />
                    </div>
                    <h2 className="text-lg font-semibold mb-1 text-gray-900">Your cart is empty</h2>
                    <p className="text-xs text-gray-500 mb-2 leading-relaxed">
                        Looks like you haven't added anything to your cart yet. Start exploring our products!
                    </p>
                    <Link
                        href="/products"
                        className="inline-flex mb-4 items-center gap-2 bg-[#415f2d] text-white px-4 py-3 rounded-full hover:bg-[#344b24] transition-all duration-300 font-medium"
                    >
                        <FiArrowLeft className="text-lg" />
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    const isFreeShipping = cartTotal >= FREE_SHIPPING_THRESHOLD;
    const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);

    const shippingCharge = isFreeShipping ? 0 : 49;
    const finalPrice = cartTotal - discount + shippingCharge;
    const savings = discount;
    const itemCount = items.reduce((n, item) => n + item.quantity, 0);

    const trust = [
        { icon: FiShield, label: 'Secure checkout' },
        { icon: FiTruck, label: 'Free shipping ₹499+' },
        { icon: FiRefreshCw, label: '7-day returns' },
    ];

    return (
        <div className="min-h-screen bg-white pb-40 lg:pb-12">
            {/* Header band */}
            <section className="bg-gradient-to-b from-green-50/60 to-white">
                <div className=" mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-5">
                    <Link href="/products" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2d4e24] hover:text-[#1e3418] mb-2">
                        <FiArrowLeft className="w-3.5 h-3.5" /> Continue shopping
                    </Link>
                    <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                        Your Bag <span className="text-gray-400 font-semibold text-lg sm:text-2xl">({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                    </h1>
                </div>
            </section>

            <div className=" mx-auto px-4 sm:px-6 lg:px-8 pb-6">
                <div className="mb-4">
                    <GiftProgress subtotal={cartTotal} />
                </div>

                <CartAddOn items={items} shortBy={amountNeeded} />

                <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-start">
                    {/* Cart Items */}
                    <ul className="lg:col-span-2 space-y-3">
                        {items.map((item) => {
                            const isGift = item.variant === 'gift';
                            const unit = item.price ?? item.product.price;
                            const mrp = item.product.mrp;
                            return (
                                <li
                                    key={`${item.product._id}-${item.variant}`}
                                    className="flex gap-4 bg-white rounded-2xl p-3 sm:p-4 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)] transition-shadow duration-300"
                                >
                                    <Link
                                        href={`/products/${item.product.slug || item.product._id}`}
                                        className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#f4f7f2] flex-shrink-0"
                                    >
                                        <img
                                            src={item.product.images?.[0]?.url || '/placeholder.png'}
                                            alt={item.product.title}
                                            className="w-full h-full object-cover"
                                        />
                                        {isGift && (
                                            <span className="absolute top-1.5 left-1.5 bg-[#2d4e24] text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full">
                                                Gift
                                            </span>
                                        )}
                                    </Link>

                                    <div className="flex-1 min-w-0 flex flex-col">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-snug line-clamp-2">
                                                    {item.product.title}
                                                </h3>
                                                {item.variant && !isGift && item.variant !== 'bump' && (
                                                    <p className="text-xs text-gray-500 mt-0.5">{item.variant}</p>
                                                )}
                                                {item.variant === 'bump' && (
                                                    <p className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wide text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                                                        Special add-on price
                                                    </p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleRemove(item.product?._id || item.product?.slug, item.variant)}
                                                className="p-1.5 -mr-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer flex-shrink-0"
                                                aria-label="Remove item"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="mt-auto pt-3 flex items-end justify-between gap-3">
                                            {isGift ? (
                                                <span className="text-xs font-bold text-[#2d4e24] bg-[#eef5ec] px-3 py-1.5 rounded-full">
                                                    Free with your order
                                                </span>
                                            ) : (
                                                <div className="flex items-center rounded-full border border-gray-200 bg-white">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.product._id, item.variant, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-[#2d4e24] disabled:opacity-40 cursor-pointer"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <FiMinus className="w-3.5 h-3.5" />
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-bold text-gray-900">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.product._id, item.variant, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-[#2d4e24] cursor-pointer"
                                                        aria-label="Increase quantity"
                                                    >
                                                        <FiPlus className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            )}

                                            <div className="text-right">
                                                {isGift ? (
                                                    <p className="text-base font-bold text-[#2d4e24]">FREE</p>
                                                ) : (
                                                    <>
                                                        <p className="text-base sm:text-lg font-bold text-gray-900">
                                                            ₹{(unit * item.quantity).toLocaleString('en-IN')}
                                                        </p>
                                                        {mrp > unit && (
                                                            <p className="text-xs text-gray-400 line-through">
                                                                ₹{(mrp * item.quantity).toLocaleString('en-IN')}
                                                            </p>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Order Summary */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden lg:sticky lg:top-24">
                            <div className="px-5 py-4 bg-[#2d4e24] text-white">
                                <h2 className="text-base font-bold tracking-tight">Order Summary</h2>
                            </div>

                            <div className="p-5 space-y-4">
                                {/* Coupon */}
                                {!couponCode ? (
                                    <div>
                                        <label className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-2">
                                            <FiTag className="text-[#2d4e24]" />
                                            Have a coupon code?
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Enter code"
                                                value={couponInput}
                                                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                                onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                                className="flex-1 min-w-0 border border-gray-200 rounded-xl px-3.5 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2d4e24]/30 focus:border-[#2d4e24] transition-all"
                                            />
                                            <button
                                                onClick={handleApplyCoupon}
                                                disabled={loading || !couponInput.trim()}
                                                className="bg-[#2d4e24] text-white px-4 py-2 rounded-xl hover:bg-[#223d1b] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold text-sm cursor-pointer"
                                            >
                                                {loading ? '...' : 'Apply'}
                                            </button>
                                        </div>
                                        {couponError && (
                                            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                                <FiX className="text-base" />
                                                {couponError}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-[#eef5ec] border border-[#2d4e24]/20 rounded-xl p-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <FiTag className="text-[#2d4e24]" />
                                            <div>
                                                <p className="text-xs font-bold text-[#2d4e24]">{couponCode}</p>
                                                <p className="text-[10px] text-gray-600">Coupon applied</p>
                                            </div>
                                        </div>
                                        <button onClick={handleRemoveCoupon} className="text-gray-500 hover:text-gray-900 cursor-pointer" aria-label="Remove coupon">
                                            <FiX className="text-lg" />
                                        </button>
                                    </div>
                                )}

                                {/* Price Breakdown */}
                                <dl className="space-y-2.5 pt-4 border-t border-gray-100 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <dt>Subtotal</dt>
                                        <dd className="font-semibold text-gray-900">₹{cartTotal.toLocaleString('en-IN')}</dd>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-[#2d4e24]">
                                            <dt>Discount</dt>
                                            <dd className="font-semibold">-₹{discount.toLocaleString('en-IN')}</dd>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-gray-600">
                                        <dt>Shipping</dt>
                                        <dd className={`font-semibold ${isFreeShipping ? 'text-[#2d4e24]' : 'text-gray-900'}`}>
                                            {isFreeShipping ? 'FREE' : '₹49'}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between items-baseline pt-3 border-t border-gray-200">
                                        <dt className="text-base font-bold text-gray-900">Total</dt>
                                        <dd className="text-2xl font-bold text-gray-900">₹{finalPrice.toLocaleString('en-IN')}</dd>
                                    </div>
                                    {savings > 0 && (
                                        <p className="text-xs text-[#2d4e24] font-semibold text-right">
                                            You're saving ₹{savings.toLocaleString('en-IN')}
                                        </p>
                                    )}
                                </dl>

                                {/* Prepaid nudge */}
                                <div className="p-3 rounded-xl bg-[#f4f7f2] border border-[#2d4e24]/15 text-[#2d4e24] text-xs flex items-center gap-2.5 font-semibold">
                                    <span className="w-8 h-8 rounded-full bg-[#2d4e24] text-white flex items-center justify-center flex-shrink-0">
                                        <FiZap className="w-4 h-4" />
                                    </span>
                                    <span>Pay online or by UPI at checkout and get an extra <strong>₹50 off</strong></span>
                                </div>

                                {/* Checkout Button */}
                                <Link
                                    href="/checkout"
                                    onClick={() => trackBeginCheckout(items, finalPrice, couponCode)}
                                    className="hidden lg:flex w-full items-center justify-center gap-2 bg-[#2d4e24] text-white py-3.5 rounded-xl hover:bg-[#223d1b] transition-all duration-300 font-bold text-sm shadow-md hover:shadow-lg"
                                >
                                    <FiLock className="text-base" />
                                    Proceed to Checkout
                                </Link>

                                {/* Trust row */}
                                <ul className="grid grid-cols-3 gap-2 pt-1">
                                    {trust.map(({ icon: Icon, label }) => (
                                        <li key={label} className="flex flex-col items-center text-center gap-1.5">
                                            <span className="w-9 h-9 rounded-full bg-[#eef5ec] text-[#2d4e24] flex items-center justify-center">
                                                <Icon className="w-4 h-4" />
                                            </span>
                                            <span className="text-[10px] font-semibold text-gray-600 leading-tight">{label}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Mobile sticky checkout bar (sits above the bottom navigation) */}
            <div className="lg:hidden fixed bottom-[calc(60px+env(safe-area-inset-bottom,0px))] left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="text-[11px] text-gray-500 font-medium">Total</p>
                        <p className="text-lg font-bold text-gray-900 leading-tight">₹{finalPrice.toLocaleString('en-IN')}</p>
                    </div>
                    <Link
                        href="/checkout"
                        onClick={() => trackBeginCheckout(items, finalPrice, couponCode)}
                        className="flex-1 max-w-[220px] flex items-center justify-center gap-2 bg-[#2d4e24] text-white py-3 rounded-xl font-bold text-sm active:scale-95 transition-all"
                    >
                        <FiLock className="text-base" />
                        Checkout
                    </Link>
                </div>
            </div>
        </div>
    );
}
