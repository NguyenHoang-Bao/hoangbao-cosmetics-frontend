import React, { useEffect } from "react";
import type { ProductFilterParams } from "@hoangbao/types";
import { Check, X } from "lucide-react";

export interface ProductSortBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentSort?: ProductFilterParams["sortBy"];
  onSelectSort: (sort: ProductFilterParams["sortBy"]) => void;
}

const SORT_OPTIONS: { id: ProductFilterParams["sortBy"]; label: string }[] = [
  { id: "newest", label: "Mới nhất (Ưu tiên)" },
  { id: "price_asc", label: "Giá: Thấp đến Cao" },
  { id: "price_desc", label: "Giá: Cao đến Thấp" },
];

export const ProductSortBottomSheet: React.FC<ProductSortBottomSheetProps> = ({
  isOpen,
  onClose,
  currentSort = "newest",
  onSelectSort,
}) => {
  // Khoá cuộn trang nền khi Bottom Sheet đang mở trên mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
      {/* 1. Backdrop mờ nền */}
      <div
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Sheet Panel trượt từ đáy lên */}
      <div className="relative w-full bg-white rounded-t-2xl shadow-2xl p-5 z-10 animate-in slide-in-from-bottom-6 duration-300">
        {/* Thanh gạt trang trí phía trên (Drag handle) */}
        <div className="w-12 h-1 bg-neutral-300 rounded-full mx-auto mb-4" />

        {/* Tiêu đề & Nút đóng */}
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-neutral-100">
          <h3 className="font-bold text-neutral-900 text-base">Sắp xếp theo</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng bảng sắp xếp"
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Danh sách các lựa chọn sắp xếp */}
        <div className="space-y-1">
          {SORT_OPTIONS.map((opt) => {
            const isSelected = currentSort === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  onSelectSort(opt.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between py-3.5 px-3 rounded-xl text-sm font-medium transition-colors text-left ${
                  isSelected
                    ? "bg-rose-50 text-rose-600 font-bold"
                    : "text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100"
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-4 h-4 text-rose-600" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductSortBottomSheet;
