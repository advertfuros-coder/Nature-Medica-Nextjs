"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  setWishlist,
  addToWishlist as addToWishlistAction,
  removeFromWishlist as removeFromWishlistAction,
  setLoading,
  setError,
  clearWishlist,
} from "@/store/slices/wishlistSlice";
import { logout } from "@/store/slices/userSlice";

export function useWishlist() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items, loading, initialized } = useSelector(
    (state) =>
      state.wishlist || { items: [], loading: false, initialized: false },
  );
  const { isAuthenticated } = useSelector(
    (state) => state.user || { isAuthenticated: false },
  );
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Fetch wishlist on mount if authenticated
  useEffect(() => {
    if (isAuthenticated && !initialized && !loading) {
      fetchWishlist();
    }
  }, [isAuthenticated, initialized, loading]);

  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      console.log("🔒 Not authenticated, skipping wishlist fetch");
      return;
    }

    try {
      console.log("🔄 Fetching wishlist from API...");
      dispatch(setLoading(true));

      const response = await fetch("/api/user/wishlist");
      console.log("📡 Response received:", {
        status: response.status,
        ok: response.ok,
      });

      if (response.status === 401) {
        console.warn("⚠️ Received 401. Logging out user...");
        dispatch(logout());
        dispatch(clearWishlist());
        return;
      }

      const data = await response.json();
      console.log("📦 Raw data from API:", data);

      if (response.ok && data.success) {
        const wishlistItems = data.wishlist || [];
        console.log("✅ Setting wishlist with items:", wishlistItems);
        dispatch(setWishlist(wishlistItems));
      } else {
        console.error("❌ Wishlist fetch failed:", data.error);
        // Still set initialized to true to prevent infinite loop
        dispatch(setWishlist([]));
        throw new Error(data.error || "Failed to fetch wishlist");
      }
    } catch (error) {
      console.error("❌ Fetch wishlist error:", error);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
      console.log("✅ Loading state set to false");
    }
  };

  const addToWishlist = async (product) => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      setTimeout(() => router.push("/auth"), 2000);
      return { success: false, message: "Please login to add to wishlist" };
    }

    try {
      const response = await fetch("/api/user/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        dispatch(addToWishlistAction(product));
        return { success: true, message: "Added to wishlist" };
      } else {
        return {
          success: false,
          message: data.message || "Failed to add to wishlist",
        };
      }
    } catch (error) {
      console.error("Add to wishlist error:", error);
      return { success: false, message: error.message };
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated) {
      return { success: false, message: "Please login" };
    }

    try {
      const response = await fetch(
        `/api/user/wishlist?productId=${productId}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        dispatch(removeFromWishlistAction(productId));
        return { success: true, message: "Removed from wishlist" };
      } else {
        return {
          success: false,
          message: data.error || "Failed to remove from wishlist",
        };
      }
    } catch (error) {
      console.error("Remove from wishlist error:", error);
      return { success: false, message: error.message };
    }
  };

  const isInWishlist = (productId) => {
    return items.some((item) => item._id === productId);
  };

  const toggleWishlist = async (product) => {
    if (isInWishlist(product._id)) {
      return await removeFromWishlist(product._id);
    } else {
      return await addToWishlist(product);
    }
  };

  return {
    wishlist: items,
    wishlistCount: items.length,
    loading,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    fetchWishlist,
    showLoginPrompt,
    setShowLoginPrompt,
  };
}
