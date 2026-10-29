import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/store/authSlice';
import cartReducer from '@/features/cart/store/cartSlice';

// Cau hinh root store cho toan bo ung dung
export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
  devTools: import.meta.env.DEV,
});

// Lay kieu RootState va AppDispatch tu store de xai cho TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
