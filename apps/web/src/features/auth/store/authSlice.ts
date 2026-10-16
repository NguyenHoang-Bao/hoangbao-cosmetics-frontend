import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@hoangbao/types';
import { tokenManager } from '@hoangbao/api-client';

// Key luu thong tin user vao localStorage de khi F5 khong bi mat dang nhap
const USER_STORAGE_KEY = 'hb_user';

// Ham phu: lay user tu localStorage an toan khi nguoi dung F5
const getInitialUser = (): User | null => {
  // Check xem dang chay o trinh duyet hay server, server khong co window
  if (typeof window === 'undefined') return null;
  const rawUser = localStorage.getItem(USER_STORAGE_KEY);
  if (!rawUser) return null;
  try {
    return JSON.parse(rawUser) as User;
  } catch {
    // Neu JSON bi loi thi xoa luon cho sach
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};

// Khai bao kieu du lieu cho State Auth
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Khoi tao state ban dau: kiem tra token va user cu trong may
const initialToken = tokenManager.getAccessToken();
const initialUser = initialToken ? getInitialUser() : null;

const initialState: AuthState = {
  user: initialUser,
  token: initialToken,
  isAuthenticated: !!initialToken && !!initialUser,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 1. Khi bam nut Dang nhap -> bat cờ loading xoay spinner, reset loi cu
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    // 2. Dang nhap thanh cong -> luu token & user vao ca Redux State lan LocalStorage
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;

      // Luu dong bo vao storage de F5 khong mat
      tokenManager.setAccessToken(token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    },

    // 3. Dang nhap that bai -> tat loading va luu thong bao loi
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // 4. Dang xuat -> clear sach se ca state lan storage
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;

      tokenManager.clearTokens();
      localStorage.removeItem(USER_STORAGE_KEY);
    },

    // 5. Xoa loi khi user go lai hoac chuyen trang
    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const { loginStart, setCredentials, loginFailure, logout, clearAuthError } =
  authSlice.actions;

export default authSlice.reducer;