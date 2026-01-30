'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import { FiShoppingCart, FiStar, FiCheck, FiTruck, FiRefreshCw, FiShield, FiPackage, FiTag } from 'react-icons/fi';
import { Zap, Heart, Share2, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { trackAddToCart, trackViewItem } from '@/utils/analytics';

export default function ProductInfo({ product }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.length > 0 ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [quickBuying, setQuickBuying] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const router = useRouter();

  const currentPrice = selectedVariant?.price || product.price;
  const currentStock = selectedVariant?.stock || product.stock;
  const currentMRP = product.mrp;
  const savings = currentMRP - currentPrice;
  const savingsPercent = Math.round(((currentMRP - currentPrice) / currentMRP) * 100);

  const handleAddToCart = () => {
    setAdding(true);
    dispatch(addToCart({
      product,
      quantity,
      variant: selectedVariant?.name
    }));

    // Track add to cart event
    trackAddToCart(product, quantity);

    setTimeout(() => setAdding(false), 1500);
  };

  const handleQuickBuy = async (e) => {
    e.preventDefault();
    setQuickBuying(true);
    dispatch(addToCart({ product, quantity, variant: selectedVariant?.name }));

    // Track add to cart event for Buy Now
    trackAddToCart(product, quantity);

    setTimeout(() => router.push('/checkout'), 500);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  // Track view_item event when product is viewed
  useEffect(() => {
    if (product) {
      trackViewItem(product);
    }
  }, [product._id]); // Track when product changes

  return (
    <div className="flex flex-col h-full pb-24 lg:pb-0">
      {/* Brand Badge */}
      <div className="mb-3">
        <span className="inline-block px-3 py-1 bg-green-50 text-[#4D6F36] text-xs font-semibold rounded-full border border-green-100">
          {product.brand}
        </span>
      </div>

      {/* Product Title */}
      <h1 className="text-xl lg:text-xl font-semibold text-gray-900 mb-3 leading-tight">
        {product.title}
      </h1>

      {/* Price Section */}
      <div className="mb-3">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-2xl font-semibold text-gray-900">
            ₹{currentPrice.toLocaleString('en-IN')}
          </span>
          {currentMRP > currentPrice && (
            <>
              <span className="text-xl text-gray-400 line-through">
                ₹{currentMRP.toLocaleString('en-IN')}
              </span>
              <span className="px-2.5 py-1 bg-red-500 text-white text-sm font-semibold rounded-md">
                {savingsPercent}% OFF
              </span>
            </>
          )}
        </div>

      </div>


      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Quantity
        </label>
        <div className="inline-flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-700 font-semibold text-lg"
            disabled={quantity <= 1}
          >
            −
          </button>
          <div className="w-16 h-12 flex items-center justify-center border-x-2 border-gray-200">
            <span className="text-base font-semibold text-gray-900">{quantity}</span>
          </div>
          <button
            onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
            className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-700 font-semibold text-lg"
            disabled={quantity >= currentStock}
          >
            +
          </button>
        </div>
      </div>


      {/* Rating & Reviews */}
      {product.reviewCount > 0 && (
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`w-4 h-4 ${i < Math.round(product.ratingAvg)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                    }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {product.ratingAvg.toFixed(1)}
            </span>
          </div>
          <div className="h-4 w-px bg-gray-300"></div>
          <span className="text-sm text-gray-600">
            {product.reviewCount.toLocaleString()} reviews
          </span>
        </div>
      )}



      {/* Key Features Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {product.isOrganic && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs font-medium text-green-700">100% Organic</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
          <FiShield className="w-3 h-3 text-blue-600" />
          <span className="text-xs font-medium text-blue-700">Lab Tested</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-full">
          <FiCheck className="w-3 h-3 text-purple-600" />
          <span className="text-xs font-medium text-purple-700">Certified</span>
        </div>
      </div>

      {/* Stock Status */}
      {currentStock > 0 ? (
        <div className="flex items-center gap-2 mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
          <FiCheck className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-sm font-semibold text-green-900">In Stock</p>
            {currentStock < 10 && (
              <p className="text-xs text-green-700">Only {currentStock} left - Order soon!</p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
          <span className="text-sm font-semibold text-red-900">Out of Stock</span>
        </div>
      )}

      {/* Variants */}
      {product.variants && product.variants.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Select Size/Variant
          </label>
          <div className="grid grid-cols-3 gap-2">
            {product.variants.map((variant, index) => (
              <button
                key={index}
                onClick={() => setSelectedVariant(variant)}
                className={`relative px-4 py-3 border-2 rounded-xl text-sm font-medium transition-all ${selectedVariant === variant
                  ? 'border-[#4D6F36] bg-green-50 text-[#4D6F36]'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <div className="text-center">
                  <div className="font-semibold">{variant.value}</div>
                  <div className="text-xs text-gray-500">{variant.name}</div>
                </div>
                {selectedVariant === variant && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#4D6F36] rounded-full flex items-center justify-center">
                    <FiCheck className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}

      {/* Delivery Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
              <FiTruck className="w-5 h-5 text-gray-700" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 mb-1">
                Fast Delivery
              </p>
              <p className="text-xs text-gray-600">
                Delivered in 3-5 business days
              </p>
            </div>
          </div>


          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
              <FiPackage className="w-5 h-5 text-gray-700" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 mb-1">
                Cash on Delivery
              </p>
              <p className="text-xs text-gray-600">
                Pay when you receive
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* Action Buttons - Desktop */}
      <div className="hidden lg:block space-y-3">
        <div className="grid grid-cols-2  gap-3">
          <button
            onClick={handleAddToCart}
            disabled={adding || currentStock === 0}
            className={`col-span- py-4 rounded-xl text-base font-semibold flex items-center justify-center gap-2 transition-all ${adding
              ? 'border-2 border-green-500 bg-green-50 text-green-700'
              : currentStock === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'border-2 border-gray-200 bg-white hover:border-[#4D6F36] hover:bg-green-50 text-gray-900 shadow-sm'
              }`}
          >
            {adding ? (
              <>
                <FiCheck className="w-5 h-5" />
                Added to Cart
              </>
            ) : currentStock === 0 ? (
              'Out of Stock'
            ) : (
              <>
                <FiShoppingCart className="w-5 h-5" />
                Add to Cart
              </>
            )}
          </button>

          <button
            onClick={handleQuickBuy}
            disabled={quickBuying || currentStock === 0}
            className={` py-4 rounded-xl text-base font-semibold flex items-center justify-center gap-2 transition-all ${currentStock === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-[#4D6F36] text-white hover:bg-[#3d5829] shadow-md hover:shadow-lg'
              }`}
          >
            <Zap className="w-5 h-5" />
            {quickBuying ? 'Processing' : 'Buy Now'}
          </button>
        </div>

      </div>

      {/* Mobile Fixed Bottom Bar */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-white border-t-2 border-gray-200  p-3 z-50">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleAddToCart}
            disabled={adding || currentStock === 0}
            className={`py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${adding
              ? 'border-2 border-green-500 bg-green-50 text-green-700'
              : currentStock === 0
                ? 'bg-gray-200 text-gray-400'
                : 'border-2 border-gray-200 bg-white hover:border-[#4D6F36] hover:bg-green-50 text-gray-900'
              }`}
          >
            {adding ? (
              <>
                <FiCheck className="w-4 h-4" />
                Added
              </>
            ) : currentStock === 0 ? (
              'Out of Stock'
            ) : (
              <>
                <FiShoppingCart className="w-4 h-4" />
                Add to Cart
              </>
            )}
          </button>

          <button
            onClick={handleQuickBuy}
            disabled={quickBuying || currentStock === 0}
            className={`py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${currentStock === 0
              ? 'bg-gray-200 text-gray-400'
              : 'bg-[#4D6F36] text-white hover:bg-[#3d5829]'
              }`}
          >
            <Zap className="w-4 h-4" />
            {quickBuying ? 'Wait...' : 'Buy Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
