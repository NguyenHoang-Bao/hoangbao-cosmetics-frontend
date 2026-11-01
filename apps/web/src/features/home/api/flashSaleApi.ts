import { apiClient } from '@hoangbao/api-client';
import type { ApiResponse, FlashSaleResponse } from '@hoangbao/types';

export const flashSaleApi = {
  /**
   * Lấy thông tin đợt Flash Sale đang hoạt động
   * Nếu không có đợt sale nào hoặc lỗi mạng, trả về null để giao diện fallback mượt mà
   */
  getActiveFlashSale: async (): Promise<FlashSaleResponse | null> => {
    try {
      const response = await apiClient.get<ApiResponse<FlashSaleResponse>>('/api/flash-sales/active');
      return response.data.data;
    } catch {
      return null;
    }
  },
};
