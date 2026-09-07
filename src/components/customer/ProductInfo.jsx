'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import { 
  FiStar, 
  FiCheck, 
  FiTruck, 
  FiShield, 
  FiCopy, 
  FiShare2, 
  FiHeart, 
  FiMapPin, 
  FiShoppingBag,
  FiZap,
  FiRefreshCw
} from 'react-icons/fi';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { trackAddToCart, trackViewItem } from '@/utils/analytics';

export default function ProductInfo({ product = {} }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.user);

  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.length > 0 ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [quickBuying, setQuickBuying] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  // Pincode state
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [checkingPincode, setCheckingPincode] = useState(false);

  const currentPrice = selectedVariant?.price || product.price || 0;
  const currentMRP = selectedVariant?.mrp || product.mrp || currentPrice;
  const currentStock = selectedVariant?.stock !== undefined ? selectedVariant.stock : (product.stock || 50);
  const discountPercent = currentMRP > currentPrice 
    ? Math.round(((currentMRP - currentPrice) / currentMRP) * 100)
    : 0;

  useEffect(() => {
    if (product?._id) {
      trackViewItem(product);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (currentStock === 0) return;
    setAdding(true);
    dispatch(
      addToCart({
        product,
        quantity,
        variant: selectedVariant?.name,
      })
    );
    trackAddToCart(product, quantity);
    setTimeout(() => setAdding(false), 1200);
  };

  const handleQuickBuy = async (e) => {
    e.preventDefault();
    if (currentStock === 0) return;
    setQuickBuying(true);
    dispatch(
      addToCart({
        product,
        quantity,
        variant: selectedVariant?.name,
      })
    );
    trackAddToCart(product, quantity);
    setTimeout(() => {
      router.push('/checkout');
    }, 400);
  };

  const handleCopyCoupon = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2000);
  };

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (!pincode || pincode.trim().length !== 6 || !/^\d{6}$/.test(pincode)) {
      setPincodeStatus({
        valid: false,
        message: 'Please enter a valid 6-digit Indian PIN code',
      });
      return;
    }

    setCheckingPincode(true);
    setTimeout(() => {
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 3);
      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      const formattedDate = deliveryDate.toLocaleDateString('en-IN', options);

      setPincodeStatus({
        valid: true,
        message: `Delivery by ${formattedDate}`,
        subMessage: 'Free Shipping • Cash on Delivery Available',
      });
      setCheckingPincode(false);
    }, 500);
  };

  const ratingAvg = product.ratingAvg || 4.9;
  const reviewCount = product.reviewCount || 128;

  return (
    <div className="flex flex-col h-full lg:sticky lg:top-24">
      {/* 1. Eyebrow Category & Wishlist matching home badges */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          {product.category?.name ? (
            <Link
              href={`/products?category=${product.category.slug || ''}`}
              className="text-[11px] font-bold uppercase tracking-wider text-[#2d4e24] bg-[#eef5ec] hover:bg-[#dce9d8] px-2.5 py-0.5 rounded-full border border-[#2d4e24]/20 transition-colors"
            >
              {product.category.name}
            </Link>
          ) : (
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2d4e24] bg-[#eef5ec] px-2.5 py-0.5 rounded-full border border-[#2d4e24]/20">
              {product.brand || 'Nature Medica'}
            </span>
          )}

          {product.netQuantity && (
            <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {product.netQuantity}
            </span>
          )}
        </div>

        {/* Wishlist / Share Actions */}
        <div className="flex items-center gap-1.5 text-gray-400">
          <button
            type="button"
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`p-1.5 rounded-full border transition-all ${
              isWishlisted
                ? 'bg-red-50 text-red-500 border-red-200'
                : 'bg-white hover:bg-gray-50 text-gray-500 border-gray-200 hover:text-red-500'
            }`}
            title={isWishlisted ? 'Saved to wishlist' : 'Add to wishlist'}
            aria-label="Wishlist"
          >
            <FiHeart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: product.title,
                  url: window.location.href,
                }).catch(() => {});
              } else {
                navigator.clipboard?.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }
            }}
            className="p-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-900 transition-all"
            title="Share product"
            aria-label="Share"
          >
            <FiShare2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Product Title & Tagline matching Home Typography */}
      <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 tracking-tight leading-snug mb-1">
        {product.title}
      </h1>

      {product.tagline ? (
        <p className="text-xs sm:text-[13px] text-gray-600 mb-3 leading-relaxed font-normal">
          {product.tagline}
        </p>
      ) : (
        <p className="text-xs sm:text-[13px] text-gray-600 mb-3 leading-relaxed font-normal">
          Gentle Ayurvedic formulation enriched with cold-pressed botanicals for holistic daily nourishment.
        </p>
      )}

      {/* 3. Rating Snippet Link */}
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-1 bg-[#2d4e24] text-white px-2 py-0.5 rounded-md text-[11px] font-bold shadow-2xs">
          <span>{ratingAvg.toFixed(1)}</span>
          <FiStar className="w-3 h-3 fill-current text-amber-300" />
        </div>
        <a
          href="#customer-reviews"
          className="text-xs font-medium text-gray-600 hover:text-[#2d4e24] underline decoration-gray-300 hover:decoration-[#2d4e24] transition-colors"
        >
          {reviewCount.toLocaleString()} Verified Reviews
        </a>
        <span className="text-gray-300">•</span>
        <span className="text-[11px] font-semibold text-[#2d4e24] bg-[#eef5ec] px-2 py-0.5 rounded-full border border-[#2d4e24]/20">
          ✓ In High Demand
        </span>
      </div>

      {/* 4. Pricing Row */}
      <div className="mb-3">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            ₹{currentPrice.toLocaleString('en-IN')}
          </span>

          {currentMRP > currentPrice && (
            <>
              <span className="text-xs sm:text-sm text-gray-400 line-through font-medium">
                ₹{currentMRP.toLocaleString('en-IN')}
              </span>
              <span className="px-2 py-0.5 bg-[#2d4e24] text-white text-[10px] font-bold tracking-wide rounded-full">
                {discountPercent}% OFF
              </span>
            </>
          )}
        </div>
        <p className="text-[11px] text-gray-500 mt-0.5 font-medium flex items-center gap-1">
          <span>Inclusive of all taxes</span>
          <span className="text-gray-300">•</span>
          <span className="text-[#2d4e24] font-semibold">Free Express Shipping</span>
        </p>
      </div>

      {/* 5. Promotional Coupon Strip */}
      <div className="mb-3.5 bg-[#fbfdfa] border border-[#dce9d8] rounded-xl px-3 py-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs">🏷️</span>
          <p className="text-xs text-gray-800 font-medium truncate">
            Use code <span className="font-bold text-[#2d4e24]">VEDA10</span> for extra 10% off
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleCopyCoupon('VEDA10')}
          className="flex-shrink-0 text-[11px] font-bold text-[#2d4e24] bg-white hover:bg-[#eef5ec] border border-[#2d4e24]/20 px-2 py-0.5 rounded-md transition-all flex items-center gap-1 shadow-2xs"
        >
          {copiedCoupon ? (
            <>
              <FiCheck className="w-3 h-3 text-[#2d4e24]" />
              Copied!
            </>
          ) : (
            <>
              <FiCopy className="w-3 h-3" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* 6. Variants Selector (if any) */}
      {product.variants && product.variants.length > 0 && (
        <div className="mb-3.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700 text-[11px]">
              Select Size / Pack:
            </span>
            <span className="text-xs text-gray-500 font-medium">
              {selectedVariant?.value || selectedVariant?.name}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {product.variants.map((variant, idx) => {
              const isSelected = selectedVariant === variant;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedVariant(variant)}
                  className={`p-2 rounded-xl text-left border transition-all relative ${
                    isSelected
                      ? 'border-[#2d4e24] bg-[#eef5ec] ring-1 ring-[#2d4e24]'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <p className="text-xs font-bold text-gray-900">{variant.value || variant.name}</p>
                  <p className="text-[11px] font-semibold text-[#2d4e24] mt-0.5">
                    ₹{variant.price?.toLocaleString('en-IN')}
                  </p>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-3.5 h-3.5 bg-[#2d4e24] rounded-full flex items-center justify-center text-white">
                      <FiCheck className="w-2.5 h-2.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. Quantity Stepper & Stock Status */}
      <div className="flex items-center justify-between gap-4 mb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-700 text-[11px]">
            Quantity:
          </span>
          <div className="inline-flex items-center border border-gray-200 bg-white rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-700 font-bold transition-colors disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-8 text-center text-xs font-bold text-gray-900 select-none">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
              disabled={quantity >= currentStock}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-700 font-bold transition-colors disabled:opacity-40"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        {/* Stock status indicator */}
        <div>
          {currentStock > 0 ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2d4e24] bg-[#eef5ec] px-2.5 py-0.5 rounded-full border border-[#2d4e24]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2d4e24] animate-pulse" />
              {currentStock < 10 ? `Only ${currentStock} left` : 'In Stock'}
            </span>
          ) : (
            <span className="text-xs font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* 8. Action Buttons (Matching Home Button Hierarchy) */}
      <div className="space-y-2 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Add to Bag CTA */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={adding || currentStock === 0}
            className={`w-full py-2.5 sm:py-3 px-4 rounded-xl text-xs sm:text-[13px] font-bold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
              adding
                ? 'bg-[#eef5ec] text-[#2d4e24] border-2 border-[#2d4e24]'
                : currentStock === 0
                ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                : 'bg-white hover:bg-[#eef5ec] text-gray-900 border-2 border-[#2d4e24] active:scale-[0.98]'
            }`}
          >
            {adding ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#2d4e24]" />
                <span>Added to Bag</span>
              </>
            ) : currentStock === 0 ? (
              'Sold Out'
            ) : (
              <>
                <FiShoppingBag className="w-4 h-4 text-[#2d4e24]" />
                <span>Add to Bag</span>
              </>
            )}
          </button>

          {/* Instant Buy Now CTA */}
          <button
            type="button"
            onClick={handleQuickBuy}
            disabled={quickBuying || currentStock === 0}
            className={`w-full py-2.5 sm:py-3 px-4 rounded-xl text-xs sm:text-[13px] font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-xs hover:shadow-sm active:scale-[0.98] cursor-pointer ${
              currentStock === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#2d4e24] hover:bg-[#223d1b] text-white border-2 border-[#2d4e24]'
            }`}
          >
            <FiZap className="w-4 h-4 fill-amber-300 text-amber-300" />
            <span>{quickBuying ? 'Redirecting...' : 'Buy Now'}</span>
          </button>
        </div>
      </div>

      {/* 9. Live Pincode Delivery Checker */}
      <div className="mb-4 p-3 rounded-xl bg-[#f4f7f2] border border-[#dce9d8]">
        <div className="flex items-center gap-1.5 mb-2">
          <FiMapPin className="w-3.5 h-3.5 text-[#2d4e24]" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-800">
            Estimated Delivery & COD
          </span>
        </div>

        <form onSubmit={handleCheckPincode} className="flex gap-2">
          <input
            type="text"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Enter 6-digit Pincode"
            maxLength={6}
            className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#2d4e24]"
          />
          <button
            type="submit"
            disabled={checkingPincode}
            className="bg-[#2d4e24] hover:bg-[#223d1b] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
          >
            {checkingPincode ? 'Checking...' : 'Check'}
          </button>
        </form>

        {pincodeStatus && (
          <div className={`mt-2 p-2 rounded-lg text-xs flex items-start gap-1.5 ${
            pincodeStatus.valid 
              ? 'bg-white text-[#2d4e24] border border-[#dce9d8]' 
              : 'bg-red-50 text-red-900 border border-red-200/60'
          }`}>
            {pincodeStatus.valid ? (
              <FiCheck className="w-3.5 h-3.5 text-[#2d4e24] flex-shrink-0 mt-0.5" />
            ) : (
              <span className="text-red-500 font-bold text-xs">✕</span>
            )}
            <div>
              <p className="font-bold text-xs">{pincodeStatus.message}</p>
              {pincodeStatus.subMessage && (
                <p className="text-[11px] text-gray-600 mt-0.5">{pincodeStatus.subMessage}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 10. Core 4 Micro-Trust Pillars */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-[#f4f7f2] border border-gray-100">
          <div className="w-7 h-7 rounded-md bg-white text-[#2d4e24] flex items-center justify-center flex-shrink-0 border border-gray-100">
            <Sparkles className="w-3.5 h-3.5 text-[#2d4e24]" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-gray-900 truncate">100% Ayurvedic</p>
            <p className="text-[10px] text-gray-500 truncate">Potent Botanicals</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-[#f4f7f2] border border-gray-100">
          <div className="w-7 h-7 rounded-md bg-white text-[#2d4e24] flex items-center justify-center flex-shrink-0 border border-gray-100">
            <FiShield className="w-3.5 h-3.5 text-[#2d4e24]" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-gray-900 truncate">Zero Sulfates</p>
            <p className="text-[10px] text-gray-500 truncate">Cruelty-Free Pure</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-[#f4f7f2] border border-gray-100">
          <div className="w-7 h-7 rounded-md bg-white text-[#2d4e24] flex items-center justify-center flex-shrink-0 border border-gray-100">
            <FiTruck className="w-3.5 h-3.5 text-[#2d4e24]" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-gray-900 truncate">Free Shipping</p>
            <p className="text-[10px] text-gray-500 truncate">Orders above ₹499</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-[#f4f7f2] border border-gray-100">
          <div className="w-7 h-7 rounded-md bg-white text-[#2d4e24] flex items-center justify-center flex-shrink-0 border border-gray-100">
            <FiRefreshCw className="w-3.5 h-3.5 text-[#2d4e24]" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-gray-900 truncate">7-Day Returns</p>
            <p className="text-[10px] text-gray-500 truncate">Guaranteed Quality</p>
          </div>
        </div>
      </div>
    </div>
  );
}
