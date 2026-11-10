export type DiscountType = "PERCENTAGE" | "FIXED_AMOUNT";

export interface Coupon {
  idCoupon: number;
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usedCount: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

export interface ApplyCouponRequest {
  code: string;
  orderAmount: number;
}

export interface ApplyCouponResponse {
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  discountAmount: number;
  originalAmount: number;
  finalAmount: number;
  message: string;
}
