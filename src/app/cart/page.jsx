'use client';

import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, applyCoupon, removeCoupon } from '@/store/slices/cartSlice';
import Link from 'next/link';
import Image from 'next/image';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useState } from 'react';

export default function CartPage() {
  const dispatch = useDispatch();
  const { items, totalPrice, discount, couponCode } = useSelector((state) => state.cart);
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
          orderValue: totalPrice 
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
        setCouponError(data.error);
      }
    } catch (error) {
      setCouponError('Failed to apply coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <FiShoppingBag className="mx-auto text-6xl text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Add some products to get started</p>
        <Link 
          href="/products"
          className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const finalPrice = totalPrice - discount;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            {items.map((item) => (
              <div 
                key={`${item.product._id}-${item.variant}`}
                className="flex items-center gap-4 p-4 border-b last:border-b-0"
              >
                <img
                  src={item.product.images[0]?.url || '/placeholder.png'}
                  alt={item.product.title}
                  width={100}
                  height={100}
                  className="rounded-lg object-cover"
                />

                <div className="flex-1">
                  <h3 className="font-semibold">{item.product.title}</h3>
                  {item.variant && (
                    <p className="text-sm text-gray-600">Variant: {item.variant}</p>
                  )}
                  <p className="text-green-600 font-bold mt-1">₹{item.price}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateQuantity(item.product._id, item.variant, item.quantity - 1)}
                    className="w-8 h-8 rounded border hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="w-12 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.product._id, item.variant, item.quantity + 1)}
                    className="w-8 h-8 rounded border hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-bold">₹{item.price * item.quantity}</p>
                  <button
                    onClick={() => handleRemove(item.product._id, item.variant)}
                    className="text-red-500 hover:text-red-700 mt-2"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{totalPrice}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({couponCode})</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              <div className="border-t pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{finalPrice}</span>
                </div>
              </div>
            </div>

            {!couponCode ? (
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 border rounded px-3 py-2"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={loading}
                    className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="text-red-500 text-sm mt-2">{couponError}</p>
                )}
              </div>
            ) : (
              <div className="mb-4 p-3 bg-green-50 rounded flex justify-between items-center">
                <span className="text-green-700">Coupon applied: {couponCode}</span>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            )}

            <Link
              href="/checkout"
              className="block w-full bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 font-semibold"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
