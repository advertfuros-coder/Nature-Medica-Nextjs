import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  loading: false,
  error: null,
  initialized: false,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist: (state, action) => {
      console.log("🔴 REDUX: setWishlist called with:", action.payload);
      console.log("🔴 REDUX: Payload length:", action.payload?.length);
      console.log("🔴 REDUX: Current state before update:", state.items);

      state.items = action.payload;
      state.initialized = true;
      state.loading = false;

      console.log("🔴 REDUX: State after update:", state.items);
      console.log("🔴 REDUX: Items count:", state.items.length);
    },
    addToWishlist: (state, action) => {
      console.log("🔴 REDUX: addToWishlist called");
      const exists = state.items.find(
        (item) => item._id === action.payload._id
      );
      if (!exists) {
        state.items.push(action.payload);
        console.log("🔴 REDUX: Product added, new count:", state.items.length);
      }
    },
    removeFromWishlist: (state, action) => {
      console.log("🔴 REDUX: removeFromWishlist called");
      state.items = state.items.filter((item) => item._id !== action.payload);
      console.log("🔴 REDUX: Product removed, new count:", state.items.length);
    },
    clearWishlist: (state) => {
      console.log("🔴 REDUX: clearWishlist called");
      state.items = [];
      state.initialized = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  setLoading,
  setError,
} = wishlistSlice.actions;

// Selectors
export const selectWishlist = (state) => state.wishlist.items;
export const selectWishlistCount = (state) => state.wishlist.items.length;
export const selectIsInWishlist = (productId) => (state) =>
  state.wishlist.items.some((item) => item._id === productId);

export default wishlistSlice.reducer;
