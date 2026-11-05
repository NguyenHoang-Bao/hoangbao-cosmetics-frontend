import { apiClient } from "@hoangbao/api-client";
import type { ApiResponse, FlashSaleResponse } from "@hoangbao/types";

export const flashSaleApi = {
  /**
   * Lấy thông tin đợt Flash Sale đang hoạt động (Public)
   */
  getActiveFlashSale: async (): Promise<FlashSaleResponse | null> => {
    try {
      const response = await apiClient.get<any, ApiResponse<FlashSaleResponse>>("/flash-sales/active");
      return response.data ?? null;
    } catch {
      return null;
    }
  },

  /**
   * Lấy danh sách tất cả các đợt Flash Sale
   */
  getAllFlashSales: async (): Promise<FlashSaleResponse[]> => {
    try {
      const response = await apiClient.get<any, ApiResponse<FlashSaleResponse[]>>("/flash-sales");
      return response.data ?? [];
    } catch {
      return [];
    }
  },

  /**
   * Lấy chi tiết đợt Flash Sale theo ID
   */
  getFlashSaleById: async (id: number): Promise<FlashSaleResponse | null> => {
    try {
      const response = await apiClient.get<any, ApiResponse<FlashSaleResponse>>(`/flash-sales/${id}`);
      return response.data ?? null;
    } catch {
      return null;
    }
  },
};
