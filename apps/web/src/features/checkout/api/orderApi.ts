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
  idOrderDetail?: number;
  idVariant: number;
  productName: string;
  sku?: string;
  capacity?: string;
  quantity: number;
  price: number;
  subTotal?: number;
  totalPrice?: number;
  image?: string;
  isReviewed?: boolean;
}

export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPING" | "DELIVERED" | "CANCELLED";

export interface OrderResponse {
  idOrder: number;
  orderCode: string;
  idUser?: number;
  customerName: string;
  phoneNumber: string;
  deliveryAddress: string;
  orderType?: "ONLINE" | "POS";
  totalProductPrice: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: string;
  transactionId?: string;
  webhookStatus?: string;
  status: OrderStatus | string;
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

  // Tra cứu đơn hàng theo mã đơn (kèm SĐT xác thực với khách vãng lai)
  getOrderByCode: async (orderCode: string, phoneNumber?: string): Promise<OrderResponse> => {
    const query =
      phoneNumber && phoneNumber.trim()
        ? `?phoneNumber=${encodeURIComponent(phoneNumber.trim())}`
        : "";
    const response = await apiClient.get<any, ApiResponse<OrderResponse>>(
      `/orders/${encodeURIComponent(orderCode.trim())}${query}`,
    );
    return response.data;
  },
};
