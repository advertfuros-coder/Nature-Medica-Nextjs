'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import { FiShoppingCart, FiStar, FiCheck } from 'react-icons/fi';

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

  const handleAddToCart = () => {
    setAdding(true);
    dispatch(addToCart({
      product,
      quantity,
      variant: selectedVariant?.name
    }));
    setTimeout(() => setAdding(false), 1000);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

      {product.reviewCount > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center text-yellow-500">
            <FiStar fill="currentColor" size={20} />
            <span className="ml-1 text-lg font-semibold">{product.ratingAvg.toFixed(1)}</span>
          </div>
          <span className="text-gray-600">({product.reviewCount} reviews)</span>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-4xl font-bold text-green-600">₹{currentPrice}</span>
          {product.mrp > currentPrice && (
            <>
              <span className="text-2xl text-gray-400 line-through">₹{product.mrp}</span>
              <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                {product.discountPercent}% OFF
              </span>
            </>
          )}
        </div>
        <p className="text-sm text-gray-600">Inclusive of all taxes</p>
      </div>

      {product.variants && product.variants.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Select Variant:</h3>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((variant, index) => (
              <button
                key={index}
                onClick={() => setSelectedVariant(variant)}
                className={`px-4 py-2 border-2 rounded-lg ${
                  selectedVariant === variant
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                {variant.name}: {variant.value}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-semibold mb-3">Quantity:</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 rounded border hover:bg-gray-100"
          >
            -
          </button>
          <span className="w-16 text-center font-semibold">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
            className="w-10 h-10 rounded border hover:bg-gray-100"
          >
            +
          </button>
        </div>
        {currentStock < 10 && currentStock > 0 && (
          <p className="text-orange-500 text-sm mt-2">Only {currentStock} left in stock!</p>
        )}
      </div>

      <div className="space-y-3 mb-6">
        <button
          onClick={handleAddToCart}
          disabled={adding || currentStock === 0}
          className={`w-full py-4 rounded-lg font-semibold flex items-center justify-center gap-2 ${
            adding
              ? 'bg-green-700 text-white'
              : currentStock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
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
      </div>

      <div className="border-t pt-6">
        <h3 className="font-semibold mb-3">Product Details:</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li><strong>Brand:</strong> {product.brand}</li>
          <li><strong>Category:</strong> {product.category.name}</li>
          {currentStock > 0 ? (
            <li className="text-green-600"><strong>Availability:</strong> In Stock</li>
          ) : (
            <li className="text-red-600"><strong>Availability:</strong> Out of Stock</li>
          )}
        </ul>
      </div>
    </div>
  );
}
