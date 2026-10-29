import React, { useState } from "react";
import { getProductImageUrl, DEFAULT_PRODUCT_IMAGE } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  name: string;
  discountPercent?: number;
  inStock?: boolean;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  name,
  discountPercent = 0,
  inStock = true,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Danh sách ảnh đã được lọc và chuẩn hóa URL
  const processedImages = images.length > 0 ? images : [DEFAULT_PRODUCT_IMAGE];
  const activeImage = getProductImageUrl(processedImages[activeImageIndex] || processedImages[0]);

  return (
    <div className="w-full lg:w-1/2 flex flex-col gap-4">
      {/* Khung ảnh chính (Tỉ lệ vuông 1:1 sang trọng) */}
      <div className="relative w-full aspect-square bg-neutral-50 rounded-2xl border border-neutral-200 overflow-hidden flex items-center justify-center p-4">
        <img
          src={activeImage}
          alt={name}
          className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src !== DEFAULT_PRODUCT_IMAGE) {
              target.src = DEFAULT_PRODUCT_IMAGE;
            }
          }}
        />

        {/* Tag giảm giá */}
        {discountPercent > 0 && (
          <span className="absolute top-4 left-4 bg-rose-500 text-white font-bold text-xs uppercase px-2.5 py-1 rounded-md shadow-xs">
            -{discountPercent}%
          </span>
        )}

        {/* Tag trạng thái tồn kho */}
        <span
          className={`absolute top-4 right-4 text-xs font-semibold px-2.5 py-1 rounded-md border ${
            inStock
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-neutral-100 text-neutral-500 border-neutral-200"
          }`}
        >
          {inStock ? "Còn hàng" : "Tạm hết hàng"}
        </span>
      </div>

      {/* Dải ảnh thumbnails bên dưới */}
      {processedImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto py-1 no-scrollbar">
          {processedImages.map((img, idx) => {
            const thumbUrl = getProductImageUrl(img);
            const isActive = activeImageIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`w-18 h-18 sm:w-20 sm:h-20 aspect-square bg-neutral-50 rounded-xl border p-1 overflow-hidden transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                  isActive
                    ? "border-rose-500 ring-2 ring-rose-200 shadow-xs"
                    : "border-neutral-200 hover:border-neutral-400 opacity-70 hover:opacity-100"
                }`}
                aria-label={`Xem ảnh ${idx + 1}`}
              >
                <img
                  src={thumbUrl}
                  alt={`${name} thumbnail ${idx + 1}`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== DEFAULT_PRODUCT_IMAGE) {
                      target.src = DEFAULT_PRODUCT_IMAGE;
                    }
                  }}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
