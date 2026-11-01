export type FlashSaleStatus = 'UPCOMING' | 'ACTIVE' | 'ENDED';

export interface FlashSaleItemResponse {
  idItem: number;
  idProduct: number;
  productName: string;
  thumbnail?: string;
  categoryName?: string;
  brandName?: string;

  // Biến thể
  idVariant: number;
  sku: string;
  capacity?: string;

  // Giá & Chiết khấu
  originalPrice: number;
  regularPrice: number;
  salePrice: number;
  discountPercent: number;

  // Số lượng & Tiến độ
  stockQuantity: number;
  soldQuantity: number;
  soldPercentage: number;
  isSoldOut: boolean;
}

export interface FlashSaleResponse {
  idFlashSale?: number;
  title: string;
  startTime?: string;
  endTime?: string;
  status: FlashSaleStatus;
  remainingSeconds: number;
  items: FlashSaleItemResponse[];
}
