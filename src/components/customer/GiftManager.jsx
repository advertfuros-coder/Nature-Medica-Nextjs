'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, updateQuantity } from '@/store/slices/cartSlice';
import { GIFT_TIERS, paidSubtotal } from '@/lib/giftTiers';

// Renders nothing. Keeps free-gift lines in the cart in sync with the paid subtotal.
export default function GiftManager() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart?.items || []);
  const [giftProducts, setGiftProducts] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/products/gifts')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setGiftProducts(data.products || []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const subtotal = paidSubtotal(items);

  useEffect(() => {
    if (giftProducts.length === 0) return;

    GIFT_TIERS.forEach((tier) => {
      const product = giftProducts.find((p) => p.slug === tier.slug);
      if (!product) return;

      const line = items.find((item) => item.product._id === product._id && item.variant === 'gift');
      const eligible = subtotal >= tier.threshold;

      if (eligible && !line) {
        dispatch(addToCart({ product: { ...product, price: 0 }, quantity: 1, variant: 'gift' }));
      } else if (!eligible && line) {
        dispatch(removeFromCart({ productId: product._id, variant: 'gift' }));
      } else if (line && line.quantity !== 1) {
        dispatch(updateQuantity({ productId: product._id, variant: 'gift', quantity: 1 }));
      }
    });
  }, [subtotal, items, giftProducts, dispatch]);

  return null;
}
