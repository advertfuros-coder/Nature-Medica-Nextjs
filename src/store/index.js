import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import userReducer from "./slices/userSlice";
import adminReducer from "./slices/adminSlice";
import wishlistReducer from "./slices/wishlistSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      user: userReducer,
      admin: adminReducer,
      wishlist: wishlistReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

export const store = makeStore();
