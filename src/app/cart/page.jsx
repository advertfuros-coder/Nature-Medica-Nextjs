'use client';

import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, applyCoupon, removeCoupon } from '@/store/slices/cartSlice';
import Link from 'next/link';
import Image from 'next/image';
import { FiTrash2, FiShoppingBag, FiX, FiTag, FiArrowLeft, FiLock } from 'react-icons/fi';
import { useState } from 'react';
 
export default function CartPage() {
  const dispatch = useDispatch();
  
  // Updated selectors to handle both total and totalPrice
  const cartState = useSelector((state) => state.cart || {});
  const { 
    items = [], 
    total = 0,
    totalPrice = 0, 
    discount = 0, 
    couponCode = null 
  } = cartState;

  // Use totalPrice if available, otherwise use total
  const cartTotal = totalPrice || total;

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateQuantity = (productId, variant, quantity) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ productId, variant, quantity }));
  };

  const handleRemove = (productId, variant) => {
    dispatch(removeFromCart({ productId, variant }));
  };

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

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-50 flex items-center justify-center">
            <FiShoppingBag className="text-5xl text-gray-300" />
          </div>
          <h2 className="text-lg font-semibold mb-3 text-gray-900">Your cart is empty</h2>
          <p className="text-xs text-gray-500 mb-8 leading-relaxed">
            Looks like you haven't added anything to your cart yet. Start exploring our products!
          </p>
          <Link 
            href="/products"
            className="inline-flex items-center gap-2 bg-[#415f2d] text-white px-4 py-3 rounded-full hover:bg-[#344b24] transition-all duration-300 font-medium"
          >
            <FiArrowLeft className="text-lg" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const finalPrice = cartTotal - discount;
  const savings = discount;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto  p-2 lg:px-8 py-3 lg:py-4">
        {/* <h1 className="text- font-semibold mb-3 text-gray-900">Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})</h1> */}
        
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-2">
            {items.map((item, index) => (
              <div 
                key={`${item.product._id}-${item.variant}`}
                className="bg-white rounded-xl p-2.5 shadow hover:shadow-md transition-shadow duration-300 border border-gray-100"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                    <img
                      src={item.product.images?.[0]?.url || '/placeholder.png'}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                          {item.product.title}
                        </h3>
                        {item.variant && (
                          <p className="text-xs text-gray-500 mb-3">
                            <span className="font-medium">Variant:</span> {item.variant}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemove(item.product._id, item.variant)}
                        className="text-gray-400 hover:text-red-500 transition-colors h-fit"
                        aria-label="Remove item"
                      >
                        <FiX className="text-xl" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 font-medium">Qty:</span>
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => handleUpdateQuantity(item.product._id, item.variant, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="w-10 h-8 flex items-center justify-center text-gray-900 font-medium border-x border-gray-200 text-xs">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.product._id, item.variant, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          ₹{((item.price || item.product.price) * item.quantity).toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          ₹{(item.price || item.product.price).toLocaleString('en-IN')} each
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary - Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-4">
              <div className="p-2.5 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">Order Summary</h2>
              </div>

              <div className="p-2.5 space-y-2.5">
                {/* Coupon Section */}
                {!couponCode ? (
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FiTag className="text-gray-400" />
                      Have a coupon code?
                    </label>
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="Enter code"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        className="flex-1 border border-gray-200 rounded-lg px-4 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#415f2d] focus:border-transparent transition-all"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={loading || !couponInput.trim()}
                        className="bg-[#415f2d] text-white px-4 py-1.5 rounded-lg hover:bg-[#344b24] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm"
                      >
                        {loading ? 'Applying...' : 'Apply'}
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
                  <div className="bg-green-50 border border-green-200 rounded-lg p-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FiTag className="text-green-600" />
                        <div>
                          <p className="text-xs font-medium text-green-900">{couponCode}</p>
                          <p className="text-[10px] text-green-700">Coupon applied successfully</p>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-green-700 hover:text-green-900 transition-colors"
                        aria-label="Remove coupon"
                      >
                        <FiX className="text-lg" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="space-y-2.5 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span className="font-medium">-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-base font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-semibold text-gray-900">
                        ₹{finalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                    {savings > 0 && (
                      <p className="text-xs text-green-600 text-right">
                        You're saving ₹{savings.toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="block w-full bg-[#415f2d] text-white text-center py-2.5 rounded-lg hover:bg-[#344b24] transition-all duration-300 font-semibold text-sm shadow-sm hover:translate-y-0.5 hover:shadow-md"
                >
                  <span className="flex items-center justify-center gap-2">
                    <FiLock className="text-lg" />
                    Proceed to Checkout
                  </span>
                </Link>

                {/* Trust Badges */}
                <div className="pt-4 space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-gray-600">
                    <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Secure checkout guaranteed</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-600">
                    <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Free shipping on all orders</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-600">
                    <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Easy returns within 7 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
