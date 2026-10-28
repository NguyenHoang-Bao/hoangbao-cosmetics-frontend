import React, { useState, type ChangeEvent } from "react";
import type { Brand, ProductFilterParams } from "@hoangbao/types";
import { ArrowUpDown, SlidersHorizontal } from "lucide-react";
import { ProductSortBottomSheet } from "./ProductSortBottomSheet";

export interface ProductSortProps {
  sortBy?: ProductFilterParams["sortBy"];
  onSortChange: (sort: ProductFilterParams["sortBy"]) => void;
  selectedBrandId?: number;
  onBrandChange: (brandId?: number) => void;
  brands: Brand[];
  totalProducts?: number;
  hasActiveFilters?: boolean;
  onOpenMobileFilter?: () => void;
}

const SORT_LABELS: Record<string, string> = {
  newest: "Mới nhất",
  price_asc: "Giá tăng dần",
  price_desc: "Giá giảm dần",
};

export const ProductSort: React.FC<ProductSortProps> = ({
  sortBy = "newest",
  onSortChange,
  selectedBrandId,
  onBrandChange,
  brands,
  totalProducts,
  hasActiveFilters = false,
  onOpenMobileFilter,
}) => {
  const [isSortSheetOpen, setIsSortSheetOpen] = useState(false);

  return (
    <div className="mb-6 pb-4 border-b border-gray-200">
      {/* ══════════════════════════════════════════════════════════
          1. GIAO DIỆN DESKTOP & TABLET NGANG (md:flex trở lên)
      ══════════════════════════════════════════════════════════ */}
      <div className="hidden md:flex justify-between items-center gap-4">
        {/* Tổng số lượng sản phẩm */}
        <div>
          {totalProducts !== undefined && (
            <span className="text-sm text-gray-500">
              Hiển thị <strong className="text-gray-800 font-semibold">{totalProducts}</strong> sản phẩm
            </span>
          )}
        </div>

        {/* Cụm Sắp xếp Desktop */}
        <div className="flex items-center gap-2 ml-auto">
          <label
            htmlFor="sortSelect"
            className="text-gray-600 font-medium whitespace-nowrap text-xs sm:text-sm"
          >
            Sắp xếp:
          </label>
          <select
            id="sortSelect"
            value={sortBy}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              onSortChange(e.target.value as ProductFilterParams["sortBy"])
            }
            className="border border-gray-300 text-gray-700 text-xs sm:text-sm rounded-md focus:ring-rose-500 focus:border-rose-500 block p-2 cursor-pointer outline-none bg-white"
          >
            <option value="newest">Mới nhất</option>
            <option value="price_asc">Giá: Thấp đến Cao</option>
            <option value="price_desc">Giá: Cao đến Thấp</option>
          </select>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          2. GIAO DIỆN MOBILE CHUẨN APP (Dưới md: < 768px)
      ══════════════════════════════════════════════════════════ */}
      <div className="md:hidden space-y-3">
        {/* Hàng 1: Thanh 2 nút cân đối 50/50 bấm cực kỳ nhạy bằng ngón cái */}
        <div className="grid grid-cols-2 gap-2">
          {/* Nút 1: Mở Bottom Sheet Sắp Xếp */}
          <button
            type="button"
            onClick={() => setIsSortSheetOpen(true)}
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 active:bg-gray-50 shadow-2xs transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-rose-500" />
            <span className="truncate">Sắp xếp: {SORT_LABELS[sortBy || "newest"]}</span>
          </button>

          {/* Nút 2: Mở Drawer Bộ Lọc */}
          <button
            type="button"
            onClick={onOpenMobileFilter}
            className="relative flex items-center justify-center gap-2 py-2.5 px-3 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 active:bg-gray-50 shadow-2xs transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-rose-500" />
            <span>Bộ lọc</span>
            {hasActiveFilters && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500" />
            )}
          </button>
        </div>

        {/* Hàng 2: Dải viên thuốc (Pills) lướt ngang chọn nhanh Thương hiệu */}
        {brands.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar scroll-smooth">
            <button
              type="button"
              onClick={() => onBrandChange(undefined)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                !selectedBrandId
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 active:bg-gray-200"
              }`}
            >
              Tất cả hãng
            </button>
            {brands.map((b) => {
              const isSelected = selectedBrandId === b.idBrand;
              return (
                <button
                  key={b.idBrand}
                  type="button"
                  onClick={() => onBrandChange(isSelected ? undefined : b.idBrand)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-rose-600 text-white shadow-xs"
                      : "bg-gray-100 text-gray-600 active:bg-gray-200"
                  }`}
                >
                  {b.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Dòng hiển thị số lượng sản phẩm trên mobile */}
        {totalProducts !== undefined && (
          <p className="text-[11px] text-gray-500 text-center">
            Có <strong>{totalProducts}</strong> sản phẩm phù hợp
          </p>
        )}
      </div>

      {/* 3. Bottom Sheet dành riêng cho Mobile khi bấm nút "Sắp xếp" */}
      <ProductSortBottomSheet
        isOpen={isSortSheetOpen}
        onClose={() => setIsSortSheetOpen(false)}
        currentSort={sortBy}
        onSelectSort={onSortChange}
      />
    </div>
  );
};

export default ProductSort;
