"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "recentlyViewed";
const MAX_ITEMS = 10;

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRecentlyViewed(parsed);
      } catch (error) {
        console.error("Error parsing recently viewed:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Add product to recently viewed
  const addToRecentlyViewed = (product) => {
    if (!product || !product._id) return;

    // Create a lightweight version of the product
    const lightProduct = {
      _id: product._id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      mrp: product.mrp,
      discountPercent: product.discountPercent,
      images: product.images?.slice(0, 1) || [], // Only keep first image
      category: product.category
        ? {
            _id: product.category._id,
            name: product.category.name,
            slug: product.category.slug,
          }
        : null,
      ratingAvg: product.ratingAvg,
      reviewCount: product.reviewCount,
      isBestSeller: product.isBestSeller,
      isNewArrival: product.isNewArrival,
      viewedAt: new Date().toISOString(),
    };

    setRecentlyViewed((prevViewed) => {
      // Remove if already exists
      const filtered = prevViewed.filter((p) => p._id !== product._id);

      // Add to beginning and limit to MAX_ITEMS
      const updated = [lightProduct, ...filtered].slice(0, MAX_ITEMS);

      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Error saving recently viewed:", error);
      }

      return updated;
    });
  };

  // Clear all recently viewed
  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Remove specific product
  const removeFromRecentlyViewed = (productId) => {
    setRecentlyViewed((prevViewed) => {
      const updated = prevViewed.filter((p) => p._id !== productId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return {
    recentlyViewed,
    addToRecentlyViewed,
    clearRecentlyViewed,
    removeFromRecentlyViewed,
    count: recentlyViewed.length,
  };
}
