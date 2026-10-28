import React, { useState, useCallback, useMemo } from "react";
import type { Category, Brand } from "@hoangbao/types";
import { ChevronDown, ChevronUp, X, RotateCcw, Check } from "lucide-react";

export interface ProductSidebarProps {
  categories: Category[];
  activeCategoryId?: number;
  onCategoryChange: (categoryId?: number) => void;
  brands?: Brand[];
  selectedBrandId?: number;
  onBrandChange?: (brandId?: number) => void;
  minPrice?: number;
  maxPrice?: number;
  onPriceChange: (minPrice?: number, maxPrice?: number) => void;
  onResetFilters?: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

const PRICE_RANGES = [
  { id: "all", label: "Tất cả mức giá", min: undefined, max: undefined },
  { id: "under200", label: "Dưới 200.000₫", min: undefined, max: 200000 },
  { id: "200to500", label: "200.000₫ - 500.000₫", min: 200000, max: 500000 },
  { id: "above500", label: "Trên 500.000₫", min: 500000, max: undefined },
];

export const ProductSidebar: React.FC<ProductSidebarProps> = ({
  categories,
  activeCategoryId,
  onCategoryChange,
  brands = [],
  selectedBrandId,
  onBrandChange,
  minPrice,
  maxPrice,
  onPriceChange,
  onResetFilters,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const [openSections, setOpenSections] = useState({
    categories: true,
    brands: true,
    price: true,
  });

  const toggleSection = useCallback((section: "categories" | "brands" | "price") => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }, []);

  const activePriceId = useMemo(() => {
    if (minPrice === 500000 && maxPrice === undefined) return "above500";
    if (minPrice === 200000 && maxPrice === 500000) return "200to500";
    if (minPrice === undefined && maxPrice === 200000) return "under200";
    return "all";
  }, [minPrice, maxPrice]);

  const hasActiveFilters = Boolean(
    activeCategoryId || selectedBrandId || minPrice !== undefined || maxPrice !== undefined
  );

  const sidebarContent = (
    <div className="flex flex-col space-y-6">
      {/* ── HEADER MOBILE DRAWER ── */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200 lg:hidden">
        <h5 className="font-bold uppercase tracking-wide text-gray-900 text-base">
          Bộ Lọc Sản Phẩm
        </h5>
        <div className="flex items-center gap-2">
          {hasActiveFilters && onResetFilters && (
            <button
              type="button"
              onClick={() => {
                onResetFilters();
                onCloseMobile?.();
              }}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Đặt lại</span>
            </button>
          )}
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Đóng bộ lọc"
            className="p-1.5 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── 1. DANH MỤC SẢN PHẨM (DYNAMIC TỪ API) ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h5 className="font-bold uppercase tracking-wide text-gray-900 text-sm">
            DANH MỤC SẢN PHẨM
          </h5>
          <button
            type="button"
            onClick={() => toggleSection("categories")}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            {openSections.categories ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {openSections.categories && (
          <div className="border border-gray-200 bg-white rounded-lg p-2 space-y-1">
            {/* Nút tất cả sản phẩm */}
            <button
              type="button"
              onClick={() => {
                onCategoryChange(undefined);
                onCloseMobile?.();
              }}
              className={`w-full text-left px-3 py-2 rounded-md font-semibold text-xs sm:text-sm transition-all flex items-center justify-between ${
                !activeCategoryId
                  ? "bg-rose-50 text-rose-600 font-bold"
                  : "text-gray-700 hover:bg-gray-50 hover:text-rose-600"
              }`}
            >
              <span>TẤT CẢ SẢN PHẨM</span>
              {!activeCategoryId && <Check className="w-3.5 h-3.5 text-rose-600" />}
            </button>

            {/* Danh sách categories động lấy từ database */}
            <div className="max-h-60 overflow-y-auto space-y-0.5 pt-1 border-t border-gray-100">
              {categories.map((cat) => {
                const isSelected = activeCategoryId === cat.idCategory;
                return (
                  <button
                    key={cat.idCategory}
                    type="button"
                    onClick={() => {
                      onCategoryChange(isSelected ? undefined : cat.idCategory);
                      onCloseMobile?.();
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-md text-xs sm:text-sm transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-rose-50 text-rose-600 font-bold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-rose-600"
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── 2. LỌC THƯƠNG HIỆU (HIỆN TRÊN MOBILE DRAWER ĐỂ DỄ CHỌN) ── */}
      {brands.length > 0 && (
        <div className="lg:hidden">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-bold uppercase tracking-wide text-gray-900 text-sm">
              THƯƠNG HIỆU
            </h5>
            <button
              type="button"
              onClick={() => toggleSection("brands")}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              {openSections.brands ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>

          {openSections.brands && (
            <div className="border border-gray-200 bg-white rounded-lg p-2 max-h-52 overflow-y-auto space-y-1">
              <button
                type="button"
                onClick={() => {
                  onBrandChange?.(undefined);
                  onCloseMobile?.();
                }}
                className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-all flex items-center justify-between ${
                  !selectedBrandId
                    ? "bg-rose-50 text-rose-600 font-bold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-rose-600"
                }`}
              >
                <span>Tất cả thương hiệu</span>
                {!selectedBrandId && <Check className="w-3.5 h-3.5 text-rose-600" />}
              </button>

              {brands.map((b) => {
                const isSelected = selectedBrandId === b.idBrand;
                return (
                  <button
                    key={b.idBrand}
                    type="button"
                    onClick={() => {
                      onBrandChange?.(isSelected ? undefined : b.idBrand);
                      onCloseMobile?.();
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-rose-50 text-rose-600 font-bold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-rose-600"
                    }`}
                  >
                    <span className="truncate">{b.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── 3. LỌC THEO MỨC GIÁ ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h5 className="font-bold uppercase tracking-wide text-gray-900 text-sm">
            MỨC GIÁ
          </h5>
          <button
            type="button"
            onClick={() => toggleSection("price")}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            {openSections.price ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {openSections.price && (
          <div className="border border-gray-200 bg-white rounded-lg p-3 space-y-2.5">
            {PRICE_RANGES.map((range) => {
              const isChecked = activePriceId === range.id;
              return (
                <label
                  key={range.id}
                  className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm text-gray-700 hover:text-rose-600 transition-colors"
                >
                  <input
                    type="radio"
                    name="priceFilter"
                    checked={isChecked}
                    onChange={() => {
                      onPriceChange(range.min, range.max);
                      onCloseMobile?.();
                    }}
                    className="w-4 h-4 text-rose-600 accent-rose-600 border-gray-300 focus:ring-rose-500 cursor-pointer"
                  />
                  <span className={isChecked ? "text-rose-600 font-bold" : ""}>
                    {range.label}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Nút Xóa bộ lọc trên Desktop */}
      {hasActiveFilters && onResetFilters && (
        <button
          type="button"
          onClick={onResetFilters}
          className="hidden lg:flex items-center justify-center gap-1.5 w-full py-2 px-3 border border-dashed border-rose-300 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Xóa tất cả bộ lọc</span>
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* ── DESKTOP SIDEBAR: Sticky bên trái ── */}
      <aside className="hidden lg:block w-full lg:w-1/4 lg:sticky lg:top-[90px] self-start shrink-0">
        {sidebarContent}
      </aside>

      {/* ── MOBILE DRAWER: Panel trượt từ cạnh phải ── */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          {/* Backdrop mờ nền */}
          <div
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          {/* Drawer trượt */}
          <div className="relative w-4/5 max-w-sm bg-white h-full overflow-y-auto p-5 shadow-2xl z-10 animate-in slide-in-from-right-8 duration-300">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductSidebar;
