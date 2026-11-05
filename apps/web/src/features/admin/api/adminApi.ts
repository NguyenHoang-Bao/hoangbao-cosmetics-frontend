import { apiClient } from "@hoangbao/api-client";
import type { ApiResponse, PageResponse } from "@hoangbao/types";
import type { OrderResponse } from "@/features/checkout/api/orderApi";

export interface DashboardOverview {
  totalRevenue: number;
  todayRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  totalCustomers: number;
  lowStockVariants: number;
}

export interface RevenueChartData {
  period: string;
  revenue: number;
  orderCount: number;
}

export interface OrderStatusDistribution {
  status: string;
  orderCount: number;
  percentage: number;
}

export interface TopSellingProduct {
  idProduct: number;
  productName: string;
  thumbnail?: string;
  categoryName?: string;
  totalQuantitySold: number;
  totalRevenue: number;
}

export interface LowStockProduct {
  idVariant: number;
  idProduct: number;
  sku: string;
  capacity?: string;
  productName: string;
  thumbnail?: string;
  stockQuantity: number;
  price: number;
}

export interface AdminOrderFilterParams {
  status?: string;
  orderType?: string;
  keyword?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export const adminApi = {
  getOverview: async (): Promise<DashboardOverview> => {
    const res = await apiClient.get<any, ApiResponse<DashboardOverview>>("/admin/dashboard/overview");
    return res.data;
  },

  getMonthlyRevenue: async (year = 0): Promise<RevenueChartData[]> => {
    const res = await apiClient.get<any, ApiResponse<RevenueChartData[]>>(
      `/admin/dashboard/revenue/monthly?year=${year}`
    );
    return res.data || [];
  },

  getOrderStatusDistribution: async (): Promise<OrderStatusDistribution[]> => {
    const res = await apiClient.get<any, ApiResponse<OrderStatusDistribution[]>>(
      "/admin/dashboard/order-status"
    );
    return res.data || [];
  },

  getTopSelling: async (limit = 5): Promise<TopSellingProduct[]> => {
    const res = await apiClient.get<any, ApiResponse<TopSellingProduct[]>>(
      `/admin/dashboard/top-selling?limit=${limit}`
    );
    return res.data || [];
  },

  getLowStock: async (threshold = 10): Promise<LowStockProduct[]> => {
    const res = await apiClient.get<any, ApiResponse<LowStockProduct[]>>(
      `/admin/dashboard/low-stock?threshold=${threshold}`
    );
    return res.data || [];
  },

  getOrders: async (params?: AdminOrderFilterParams): Promise<PageResponse<OrderResponse>> => {
    const q = new URLSearchParams();
    if (params?.status && params.status !== "ALL") q.set("status", params.status);
    if (params?.orderType) q.set("orderType", params.orderType);
    if (params?.keyword) q.set("keyword", params.keyword);
    q.set("page", String(params?.page ?? 0));
    q.set("size", String(params?.size ?? 10));
    q.set("sortBy", params?.sortBy ?? "createdAt");
    q.set("sortDir", params?.sortDir ?? "desc");

    const res = await apiClient.get<any, ApiResponse<PageResponse<OrderResponse>>>(
      `/admin/orders?${q.toString()}`
    );
    return res.data;
  },

  getOrderDetail: async (id: number): Promise<OrderResponse> => {
    const res = await apiClient.get<any, ApiResponse<OrderResponse>>(`/admin/orders/${id}`);
    return res.data;
  },

  updateOrderStatus: async (id: number, status: string, note?: string): Promise<OrderResponse> => {
    const res = await apiClient.patch<any, ApiResponse<OrderResponse>>(
      `/admin/orders/${id}/status`,
      { status, note }
    );
    return res.data;
  },

  cancelOrder: async (id: number, reason: string): Promise<OrderResponse> => {
    const res = await apiClient.post<any, ApiResponse<OrderResponse>>(
      `/admin/orders/${id}/cancel`,
      { reason }
    );
    return res.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },
};
