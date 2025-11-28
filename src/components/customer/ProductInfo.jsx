'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import { FiShoppingCart,  FiStar, FiCheck } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

import { ShoppingCart, Zap, Star } from 'lucide-react';
export default function ProductInfo({ product }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.length > 0 ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const currentPrice = selectedVariant?.price || product.price;
  const currentStock = selectedVariant?.stock || product.stock;
  const [quickBuying, setQuickBuying] = useState(false);
    const router = useRouter();


  const handleAddToCart = () => {
    setAdding(true);
    dispatch(addToCart({
      product,
      quantity,
      variant: selectedVariant?.name
    }));
    setTimeout(() => setAdding(false), 1000);
  };

    const handleQuickBuy = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickBuying(true);
    dispatch(addToCart({ product, quantity: 1, variant: null }));
    setTimeout(() => router.push('/checkout'), 500);
  };

  return (
    <div>
      <h1 className="text- font-semibold mb-1">{product.title}</h1>

      {product.reviewCount > 0 && (
        <div className="flex items-center gap-2 mb-1">
          <div className="flex items-center text-yellow-500">
            <FiStar fill="currentColor" size={20} />
            <span className="ml-1 text-sm font-semibold">{product.ratingAvg.toFixed(1)}</span>
          </div>
          <span className="text-gray-600">({product.reviewCount} reviews)</span>
        </div>
      )}

      <div className="mb-3">
        <div className="flex items-baseline gap-3 mb-2">
            <span className="text-2xl font-bold text-[#3A5D1E]">₹{currentPrice}</span>
          {product.mrp > currentPrice && (
            <>
              <span className="text-xl text-gray-700 line-through">₹{product.mrp}</span>
              <span className="bg-red-500 text-white px-1.5 py-0.5 rounded text-[11px] font-semibold">
                {product.discountPercent}% OFF
              </span>
            </>
          )}
        </div>
        {/* <p className="text-[11px] text-gray-600">Inclusive of all taxes</p> */}
      </div>

      {product.variants && product.variants.length > 0 && (
        <div className="mb-3">
          <h3 className="font-semibold mb-3 text-[11px]">Select Variant:</h3>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((variant, index) => (
              <button
                key={index}
                onClick={() => setSelectedVariant(variant)}
                className={`px-2.5 py-1 border-2 rounded-md text-[11px] font-medium ${
                  selectedVariant === variant
                      ? 'border-[#3A5D1E] bg-[#3A5D1E] text-white'
                      : 'border-gray-200 hover:border-[#3A5D1E]'
                }`}
              >
                {variant.name}: {variant.value}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="my-3 flex items-center gap-3 items-center ">
        <h3 className="font-semibold mb- text-[11px]">Quantity:</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-7 h-7 rounded border hover:bg-gray-100"
          >
            -
          </button>
          <span className="w-16 text-center text-[11px] font-semibold">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
            className="w-7 h-7 rounded border hover:bg-gray-100"
          >
            +
          </button>
        </div>
        {currentStock < 10 && currentStock > 0 && (
          <p className="text-orange-500 text-[11px] mt-2">Only {currentStock} left in stock!</p>
        )}
      </div>

      <div className="space-y-3 mb-3">
        <button
          onClick={handleAddToCart}
          disabled={adding || currentStock === 0}
          className={`w-full py-2.5 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-2 ${
            adding
                ? 'bg-[#3A5D1E] text-white'
              : currentStock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'border-2 border-[#3A5D1E] text-[#3A5D1E] hover:bg-['
          }`}
        >
          {adding ? (
            <>
              <FiCheck /> Added to Cart!
            </>
          ) : currentStock === 0 ? (
            'Out of Stock'
          ) : (
            <>
              <FiShoppingCart /> Add to Cart
            </>
          )}
        </button>

         <button
                onClick={handleQuickBuy}
                disabled={quickBuying}
                className="flex-1 w-full py-2 bg-[#415f2d]  text-white py-3 rounded-lg text-[13px] flex items-center justify-center gap-2 transition-all"
              >
                <Zap className="w-4 h-4" />
                {quickBuying ? 'Processing' : 'Buy Now'}
              </button>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-3 text-[11px]">Product Details:</h3>
        <ul className="space-y-2 text-[11px] text-gray-700">
          <li><strong>Brand:</strong> {product.brand}</li>
          {/* <li><strong>Category:</strong> {product.category.name}</li> */}
          {currentStock > 0 ? (
              <li className="text-[#3A5D1E]"><strong>Availability:</strong> In Stock</li>
          ) : (
            <li className="text-red-600"><strong>Availability:</strong> Out of Stock</li>
          )}
        </ul>
      </div>
    </div>
  );
}
