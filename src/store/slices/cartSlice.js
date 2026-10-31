import { createSlice } from '@reduxjs/toolkit';

const CART_STORAGE_KEY = 'naturemedica_cart';
const CART_EXPIRY_DAYS = 7;

// Helper: Load cart from localStorage
const loadCartFromStorage = () => {
  if (typeof window === 'undefined') return { 
    items: [], 
    total: 0, 
    discount: 0, 
    couponCode: null 
  };

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return { 
      items: [], 
      total: 0, 
      discount: 0, 
      couponCode: null 
    };

    const data = JSON.parse(stored);
    
    // Check if cart has expired (7 days)
    if (data.expiresAt && new Date().getTime() > data.expiresAt) {
      localStorage.removeItem(CART_STORAGE_KEY);
      return { 
        items: [], 
        total: 0, 
        discount: 0, 
        couponCode: null 
      };
    }

    // Filter out any expired or obsolete gifts
    const sanitizedItems = (data.items || []).filter(item => {
      if (item.variant === 'gift' && item.product?.slug === 'eco-bamboo-charcoal-brush-pack') {
        return false;
      }
      return true;
    });

    return {
      items: sanitizedItems,
      total: data.total || 0,
      discount: data.discount || 0,
      couponCode: data.couponCode || null
    };
  } catch (error) {
    console.error('Error loading cart from storage:', error);
    return { 
      items: [], 
      total: 0, 
      discount: 0, 
      couponCode: null 
    };
  }
};

// Helper: Save cart to localStorage with 7-day expiry
const saveCartToStorage = (items, total, discount, couponCode) => {
  if (typeof window === 'undefined') return;

  try {
    const expiresAt = new Date().getTime() + (CART_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    const data = {
      items,
      total,
      discount,
      couponCode,
      expiresAt,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
};

// Helper: Calculate cart total
const calculateTotal = (items) => {
  return items.reduce((sum, item) => {
    const itemPrice = item.price || item.product.price;
    return sum + (itemPrice * item.quantity);
  }, 0);
};

const initialState = {
  items: [],
  total: 0,
  totalPrice: 0, // Alias for compatibility
  discount: 0,
  couponCode: null,
  drawerOpen: false // slide-in cart drawer
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity, variant } = action.payload;
      
      const existingItemIndex = state.items.findIndex(item => {
        const sameProduct = item.product._id === product._id;
        const sameVariant = variant 
          ? item.variant === variant 
          : !item.variant;
        return sameProduct && sameVariant;
      });

      if (existingItemIndex >= 0) {
        state.items[existingItemIndex].quantity += quantity;
      } else {
        state.items.push({
          product,
          quantity,
          variant,
          price: product.price,
          addedAt: new Date().toISOString()
        });
      }

      state.total = calculateTotal(state.items);
      state.totalPrice = state.total; // Keep both for compatibility
      // Open the drawer for customer adds, not for automatic gift or checkout add-on lines
      if (variant !== 'gift' && variant !== 'bump') state.drawerOpen = true;
      saveCartToStorage(state.items, state.total, state.discount, state.couponCode);
    },

    openDrawer: (state) => {
      state.drawerOpen = true;
    },

    closeDrawer: (state) => {
      state.drawerOpen = false;
    },

    removeFromCart: (state, action) => {
      const { productId, variant } = action.payload;
      
      state.items = state.items.filter(item => {
        const sameProduct = item.product?._id === productId || item.product?.slug === productId;
        const sameVariant = variant 
          ? item.variant === variant 
          : !item.variant;
        return !(sameProduct && sameVariant);
      });

      state.total = calculateTotal(state.items);
      state.totalPrice = state.total;
      saveCartToStorage(state.items, state.total, state.discount, state.couponCode);
    },

    updateQuantity: (state, action) => {
      const { productId, variant, quantity } = action.payload;
      
      const item = state.items.find(item => {
        const sameProduct = item.product._id === productId;
        const sameVariant = variant 
          ? item.variant === variant 
          : !item.variant;
        return sameProduct && sameVariant;
      });

      if (item) {
        item.quantity = quantity;
        state.total = calculateTotal(state.items);
        state.totalPrice = state.total;
        saveCartToStorage(state.items, state.total, state.discount, state.couponCode);
      }
    },

    // Apply coupon code
    applyCoupon: (state, action) => {
      const { code, discount } = action.payload;
      state.couponCode = code;
      state.discount = discount;
      saveCartToStorage(state.items, state.total, state.discount, state.couponCode);
    },

    // Remove coupon code
    removeCoupon: (state) => {
      state.couponCode = null;
      state.discount = 0;
      saveCartToStorage(state.items, state.total, state.discount, state.couponCode);
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.totalPrice = 0;
      state.discount = 0;
      state.couponCode = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    },

    hydrateCart: (state) => {
      const stored = loadCartFromStorage();
      state.items = stored.items;
      state.total = stored.total;
      state.totalPrice = stored.total;
      state.discount = stored.discount;
      state.couponCode = stored.couponCode;
    }
  }
});

export const { 
  addToCart, 
  openDrawer,
  closeDrawer,
  removeFromCart, 
  updateQuantity, 
  applyCoupon,
  removeCoupon,
  clearCart,
  hydrateCart 
} = cartSlice.actions;

export default cartSlice.reducer;
