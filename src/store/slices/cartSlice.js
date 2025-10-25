import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  discount: 0,
  couponCode: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity, variant } = action.payload;
      const existingItem = state.items.find(
        item => item.product._id === product._id && item.variant === variant
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          product,
          quantity,
          variant,
          price: product.price
        });
      }

      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalPrice = state.items.reduce(
        (sum, item) => sum + (item.price * item.quantity), 
        0
      );
    },
    
    removeFromCart: (state, action) => {
      const { productId, variant } = action.payload;
      state.items = state.items.filter(
        item => !(item.product._id === productId && item.variant === variant)
      );
      
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalPrice = state.items.reduce(
        (sum, item) => sum + (item.price * item.quantity), 
        0
      );
    },
    
    updateQuantity: (state, action) => {
      const { productId, variant, quantity } = action.payload;
      const item = state.items.find(
        item => item.product._id === productId && item.variant === variant
      );
      
      if (item) {
        item.quantity = quantity;
      }
      
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalPrice = state.items.reduce(
        (sum, item) => sum + (item.price * item.quantity), 
        0
      );
    },
    
    applyCoupon: (state, action) => {
      const { code, discount } = action.payload;
      state.couponCode = code;
      state.discount = discount;
    },
    
    removeCoupon: (state) => {
      state.couponCode = null;
      state.discount = 0;
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      state.discount = 0;
      state.couponCode = null;
    }
  }
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  applyCoupon, 
  removeCoupon, 
  clearCart 
} = cartSlice.actions;

export default cartSlice.reducer;
