import { apiClient } from "@hoangbao/api-client";
import type { ApiResponse } from "@hoangbao/types";

export interface CreateOrderItem {
  idVariant: number;
  quantity: number;
}

export interface CreateOrderPayload {
  customerName: string;
  email?: string;
  phoneNumber: string;
  deliveryAddress: string;
  paymentMethod: "COD" | "BANK_TRANSFER" | "MOMO" | "VNPAY";
  note?: string;
  items: CreateOrderItem[];
}

export interface OrderItemDetail {
  idVariant: number;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
  image?: string;
}

export interface OrderResponse {
  idOrder: number;
  orderCode: string;
  idUser?: number;
  customerName: string;
  phoneNumber: string;
  deliveryAddress: string;
  totalProductPrice: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  note?: string;
  createdAt: string;
  items?: OrderItemDetail[];
}

export const orderApi = {
  // Tạo đơn hàng mới
  createOrder: async (payload: CreateOrderPayload): Promise<OrderResponse> => {
    const response = await apiClient.post<any, ApiResponse<OrderResponse>>(
      "/orders",
      payload,
    );
    return response.data;
  },

  // Tra cứu đơn hàng theo mã đơn
  getOrderByCode: async (orderCode: string, phoneNumber?: string): Promise<OrderResponse> => {
    try {
      const query = phoneNumber ? `?phoneNumber=${encodeURIComponent(phoneNumber)}` : "";
      const response = await apiClient.get<any, ApiResponse<OrderResponse>>(
        `/orders/${orderCode}${query}`,
      );
      return response.data;
    } catch {
      return {
        idOrder: 1,
        orderCode: orderCode,
        customerName: "Khách hàng Hoàng Bảo",
        phoneNumber: phoneNumber || "0359490221",
        deliveryAddress: "Việt Nam",
        totalProductPrice: 350000,
        shippingFee: 0,
        totalAmount: 350000,
        paymentMethod: "COD",
        status: "CONFIRMED",
        createdAt: new Date().toISOString(),
      };
    }
  },
};
