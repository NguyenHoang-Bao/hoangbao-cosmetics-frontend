import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product, ProductVariant } from "@hoangbao/types";

export interface CartItem {
  idProduct: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  brandName?: string;
  variantId?: number;
  capacity?: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const STORAGE_KEY = "hoangbao_cart";

const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Lỗi khi đọc giỏ hàng từ localStorage:", err);
    return [];
  }
};

const saveCartToStorage = (items: CartItem[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Lỗi khi lưu giỏ hàng vào localStorage:", err);
  }
};

const initialState: CartState = {
  items: loadCartFromStorage(),
  isOpen: false,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{
        product: Product;
        quantity?: number;
        variant?: ProductVariant;
      }>,
    ) => {
      const { product, quantity = 1, variant } = action.payload;
      const targetVariant = variant || product.variants?.[0];
      const price = targetVariant?.price ?? 0;
      const originalPrice = targetVariant?.originalPrice;
      const variantId = targetVariant?.idVariant;
      const capacity = targetVariant?.capacity || targetVariant?.volume;
      const brandName =
        typeof product.brand === "object" ? product.brand?.name : product.brand;
      const image = product.thumbnail || product.images?.[0] || "";

      const existingIndex = state.items.findIndex(
        (item) =>
          item.idProduct === product.idProduct && item.variantId === variantId,
      );

      if (existingIndex > -1) {
        state.items[existingIndex].quantity += quantity;
      } else {
        state.items.push({
          idProduct: product.idProduct,
          name: product.name,
          price,
          originalPrice,
          image,
          brandName,
          variantId,
          capacity,
          quantity,
        });
      }

      saveCartToStorage(state.items);
      state.isOpen = true; // Tu dong mo Drawer gio hang khi them thanh cong
    },

    removeFromCart: (
      state,
      action: PayloadAction<{ idProduct: number; variantId?: number }>,
    ) => {
      state.items = state.items.filter(
        (item) =>
          !(
            item.idProduct === action.payload.idProduct &&
            item.variantId === action.payload.variantId
          ),
      );
      saveCartToStorage(state.items);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{
        idProduct: number;
        variantId?: number;
        quantity: number;
      }>,
    ) => {
      const { idProduct, variantId, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter(
          (item) =>
            !(item.idProduct === idProduct && item.variantId === variantId),
        );
      } else {
        const item = state.items.find(
          (i) => i.idProduct === idProduct && i.variantId === variantId,
        );
        if (item) {
          item.quantity = Math.min(99, quantity);
        }
      }
      saveCartToStorage(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      saveCartToStorage([]);
    },

    openCart: (state) => {
      state.isOpen = true;
    },

    closeCart: (state) => {
      state.isOpen = false;
    },

    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  openCart,
  closeCart,
  toggleCart,
} = cartSlice.actions;

export default cartSlice.reducer;
