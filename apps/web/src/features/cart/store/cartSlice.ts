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
  stockQuantity?: number;
}

export interface CartNotification {
  item: CartItem;
  quantityAdded: number;
  timestamp: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  notification: CartNotification | null;
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
  notification: null,
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
        openDrawer?: boolean;
      }>,
    ) => {
      const { product, quantity = 1, variant, openDrawer = false } = action.payload;
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

      const stockQuantity = targetVariant?.stockQuantity;
      const maxStock = stockQuantity !== undefined ? stockQuantity : 99;

      const addedItem: CartItem = {
        idProduct: product.idProduct,
        name: product.name,
        price,
        originalPrice,
        image,
        brandName,
        variantId,
        capacity,
        quantity,
        stockQuantity,
      };

      if (existingIndex > -1) {
        const currentQty = state.items[existingIndex].quantity;
        const newQty = Math.min(maxStock, currentQty + quantity);
        state.items[existingIndex].quantity = newQty;
        if (stockQuantity !== undefined) {
          state.items[existingIndex].stockQuantity = stockQuantity;
        }
      } else {
        addedItem.quantity = Math.min(maxStock, quantity);
        state.items.push(addedItem);
      }

      saveCartToStorage(state.items);
      // Giữ nguyên trạng thái Drawer (không tự động bung ra trừ khi openDrawer=true)
      state.isOpen = openDrawer;
      // Kích hoạt notification thông báo nổi và animation icon
      state.notification = {
        item: addedItem,
        quantityAdded: quantity,
        timestamp: Date.now(),
      };
    },

    dismissNotification: (state) => {
      state.notification = null;
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
          const maxStock = item.stockQuantity !== undefined ? item.stockQuantity : 99;
          item.quantity = Math.min(maxStock, quantity);
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
  dismissNotification,
  removeFromCart,
  updateQuantity,
  clearCart,
  openCart,
  closeCart,
  toggleCart,
} = cartSlice.actions;

export default cartSlice.reducer;
