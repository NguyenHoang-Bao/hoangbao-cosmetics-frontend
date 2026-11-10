import { apiClient } from "@hoangbao/api-client";
import type { ApiResponse, Coupon, ApplyCouponRequest, ApplyCouponResponse } from "@hoangbao/types";

export const couponApi = {
  // Lấy danh sách các mã giảm giá đang kích hoạt từ Backend
  getActiveCoupons: async (): Promise<Coupon[]> => {
    try {
      const response = await apiClient.get<any, ApiResponse<Coupon[]>>("/coupons");
      if (response && response.data && Array.isArray(response.data)) {
        return response.data;
      }
    } catch (err) {
      console.warn("[couponApi.getActiveCoupons] Lỗi tải voucher từ server:", err);
    }
    return [];
  },

  // Áp dụng mã giảm giá và tính toán số tiền chiết khấu
  applyCoupon: async (payload: ApplyCouponRequest): Promise<ApplyCouponResponse> => {
    const response = await apiClient.post<any, ApiResponse<ApplyCouponResponse>>(
      "/coupons/apply",
      payload
    );
    if (response && response.data) {
      return response.data;
    }
    throw new Error(response?.message || "Không thể áp dụng mã giảm giá");
  }
};
