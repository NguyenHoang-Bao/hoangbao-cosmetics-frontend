import React, { useState, useCallback, useMemo } from "react";
import type { Category, Brand } from "@hoangbao/types";
import { ChevronDown, ChevronUp, X, Search, Check } from "lucide-react";

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
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

const PRICE_RANGES = [
  { id: "all", label: "Tất cả mức giá", min: undefined, max: undefined },
  { id: "under200", label: "Dưới 200.000₫", min: undefined, max: 200000 },
  { id: "200to500", label: "200.000₫ - 500.000₫", min: 200000, max: 500000 },
  { id: "above500", label: "Trên 500.000₫", min: 500000, max: undefined },
];

interface CategoryGroupConfig {
  id: string;
  title: string;
  slugs: string[];
  keywords: string[];
}

const CATEGORY_GROUP_CONFIGS: CategoryGroupConfig[] = [
  {
    id: "skincare",
    title: "Chăm Sóc Da",
    slugs: ["sua-rua-mat", "kem-chong-nang", "tinh-chat", "kem-duong", "tay-trang", "mat-na", "tay-da-chet", "kem-duong-mat"],
    keywords: ["da", "mặt", "mắt", "serum", "dưỡng ẩm", "rửa mặt", "tẩy trang", "chống nắng", "tế bào chết"],
  },
  {
    id: "makeup",
    title: "Trang Điểm",
    slugs: ["son-moi", "cushion", "kem-lot-nen", "phan-phu"],
    keywords: ["son", "cushion", "nền", "lót", "phấn", "makeup", "trang điểm", "má"],
  },
  {
    id: "body_hair",
    title: "Tóc & Cơ Thể",
    slugs: ["cham-soc-co-the", "cham-soc-toc", "nuoc-hoa", "tpcn"],
    keywords: ["tóc", "cơ thể", "nước hoa", "body", "thực phẩm chức năng", "tpcn", "tắm", "gội"],
  },
];

const INITIAL_VISIBLE_BRANDS = 6;

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
  isOpenMobile = false,
  onCloseMobile,
}) => {
  // Trạng thái mở Accordion từng nhóm danh mục
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    skincare: true,
    makeup: true,
    body_hair: true,
    others: true,
  });

  const [openBrandSection, setOpenBrandSection] = useState(true);
  const [openPriceSection, setOpenPriceSection] = useState(true);

  // Tìm kiếm nhanh thương hiệu
  const [brandSearch, setBrandSearch] = useState("");
  // Xem thêm thương hiệu
  const [isExpandedBrands, setIsExpandedBrands] = useState(false);

  const toggleGroup = useCallback((groupId: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  }, []);

  // Phân bổ danh mục động từ Backend vào các nhóm chuẩn
  const groupedCategories = useMemo(() => {
    const map: Record<string, Category[]> = {
      skincare: [],
      makeup: [],
      body_hair: [],
      others: [],
    };

    categories.forEach((cat) => {
      const slug = cat.slug?.toLowerCase() || "";
      const name = cat.name.toLowerCase();

      let matched = false;
      for (const config of CATEGORY_GROUP_CONFIGS) {
        if (config.slugs.includes(slug) || config.keywords.some((k) => name.includes(k))) {
          map[config.id].push(cat);
          matched = true;
          break;
        }
      }

      if (!matched) {
        map.others.push(cat);
      }
    });

    return map;
  }, [categories]);

  // Lọc thương hiệu theo ô search
  const filteredBrands = useMemo(() => {
    if (!brandSearch.trim()) return brands;
    const query = brandSearch.trim().toLowerCase();
    return brands.filter((b) => b.name.toLowerCase().includes(query));
  }, [brands, brandSearch]);

  const displayedBrands = useMemo(() => {
    if (isExpandedBrands || brandSearch.trim()) {
      return filteredBrands;
    }
    return filteredBrands.slice(0, INITIAL_VISIBLE_BRANDS);
  }, [filteredBrands, isExpandedBrands, brandSearch]);

  const activePriceId = useMemo(() => {
    if (minPrice === 500000 && maxPrice === undefined) return "above500";
    if (minPrice === 200000 && maxPrice === 500000) return "200to500";
    if (minPrice === undefined && maxPrice === 200000) return "under200";
    return "all";
  }, [minPrice, maxPrice]);

  const sidebarContent = (
    <div className="flex flex-col space-y-7 text-neutral-800">
      {/* ── HEADER MOBILE DRAWER ── */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200 lg:hidden">
        <h5 className="font-bold uppercase tracking-wider text-neutral-900 text-sm">
          Bộ Lọc
        </h5>
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Đóng bộ lọc"
          className="p-1 rounded-md text-neutral-400 hover:text-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* ── KHỐI 1: DANH MỤC SẢN PHẨM ── */}
      <div>
        <h5 className="font-bold uppercase tracking-wider text-neutral-900 text-xs mb-3">
          DANH MỤC
        </h5>

        {/* Nút xem Tất cả */}
        <button
          type="button"
          onClick={() => {
            onCategoryChange(undefined);
            onCloseMobile?.();
          }}
          className={`w-full text-left py-2 text-xs uppercase tracking-wide transition-colors border-b ${
            !activeCategoryId
              ? "font-bold text-neutral-900 border-neutral-900"
              : "font-medium text-neutral-500 border-neutral-100 hover:text-neutral-900"
          }`}
        >
          Tất cả sản phẩm
        </button>

        {/* Danh sách các nhóm danh mục Accordion phong cách tối giản cao cấp */}
        <div className="divide-y divide-neutral-100 pt-1">
          {CATEGORY_GROUP_CONFIGS.map((config) => {
            const items = groupedCategories[config.id] || [];
            if (items.length === 0) return null;

            const isOpen = openGroups[config.id];
            const hasActiveItem = items.some((item) => item.idCategory === activeCategoryId);

            return (
              <div key={config.id} className="py-2.5">
                {/* Header nhóm */}
                <button
                  type="button"
                  onClick={() => toggleGroup(config.id)}
                  className="w-full flex items-center justify-between py-1 text-[13px] font-semibold text-neutral-900 hover:text-neutral-700 transition-colors"
                >
                  <span className={hasActiveItem ? "text-rose-600 font-bold" : ""}>
                    {config.title}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-3.5 h-3.5 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                  )}
                </button>

                {/* Danh mục con */}
                {isOpen && (
                  <div className="pl-2 pt-1.5 space-y-1">
                    {items.map((cat) => {
                      const isSelected = activeCategoryId === cat.idCategory;
                      return (
                        <button
                          key={cat.idCategory}
                          type="button"
                          onClick={() => {
                            onCategoryChange(isSelected ? undefined : cat.idCategory);
                            onCloseMobile?.();
                          }}
                          className={`w-full text-left py-1 text-xs transition-colors flex items-center justify-between ${
                            isSelected
                              ? "font-semibold text-rose-600"
                              : "text-neutral-600 hover:text-neutral-900"
                          }`}
                        >
                          <span className="truncate">{cat.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Nhóm Danh Mục Khác (nếu có từ Admin) */}
          {groupedCategories.others && groupedCategories.others.length > 0 && (
            <div className="py-2.5">
              <button
                type="button"
                onClick={() => toggleGroup("others")}
                className="w-full flex items-center justify-between py-1 text-[13px] font-semibold text-neutral-900 hover:text-neutral-700 transition-colors"
              >
                <span>Khác</span>
                {openGroups.others ? (
                  <ChevronUp className="w-3.5 h-3.5 text-neutral-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                )}
              </button>

              {openGroups.others && (
                <div className="pl-2 pt-1.5 space-y-1">
                  {groupedCategories.others.map((cat) => {
                    const isSelected = activeCategoryId === cat.idCategory;
                    return (
                      <button
                        key={cat.idCategory}
                        type="button"
                        onClick={() => {
                          onCategoryChange(isSelected ? undefined : cat.idCategory);
                          onCloseMobile?.();
                        }}
                        className={`w-full text-left py-1 text-xs transition-colors flex items-center justify-between ${
                          isSelected
                            ? "font-semibold text-rose-600"
                            : "text-neutral-600 hover:text-neutral-900"
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── KHỐI 2: BỘ LỌC THƯƠNG HIỆU (BRAND) ── */}
      {brands.length > 0 && (
        <div className="pt-5 border-t border-neutral-200">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-bold uppercase tracking-wider text-neutral-900 text-xs">
              THƯƠNG HIỆU
            </h5>
            <button
              type="button"
              onClick={() => setOpenBrandSection((prev) => !prev)}
              className="text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              {openBrandSection ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {openBrandSection && (
            <div className="space-y-3">
              {/* Ô tìm kiếm thương hiệu thanh mảnh */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Tìm thương hiệu..."
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-50/80 border border-neutral-200 rounded-md focus:outline-none focus:border-neutral-500 text-neutral-800 placeholder-neutral-400 transition-colors"
                />
              </div>

              {/* Danh sách thương hiệu phong cách Checkbox tối giản */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {displayedBrands.length === 0 ? (
                  <p className="text-xs text-neutral-400 text-center py-2">
                    Không tìm thấy thương hiệu
                  </p>
                ) : (
                  displayedBrands.map((b) => {
                    const isSelected = selectedBrandId === b.idBrand;
                    return (
                      <label
                        key={b.idBrand}
                        className="flex items-center gap-2.5 cursor-pointer text-xs text-neutral-700 hover:text-neutral-900 transition-colors group"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            onBrandChange?.(isSelected ? undefined : b.idBrand);
                            onCloseMobile?.();
                          }}
                          className="w-3.5 h-3.5 rounded border-neutral-300 text-neutral-900 focus:ring-0 cursor-pointer accent-neutral-900"
                        />
                        <span className={`truncate ${isSelected ? "font-bold text-neutral-900" : ""}`}>
                          {b.name}
                        </span>
                      </label>
                    );
                  })
                )}
              </div>

              {/* Nút Xem thêm / Thu gọn */}
              {!brandSearch && filteredBrands.length > INITIAL_VISIBLE_BRANDS && (
                <button
                  type="button"
                  onClick={() => setIsExpandedBrands((prev) => !prev)}
                  className="text-xs text-neutral-500 hover:text-neutral-900 font-medium transition-colors pt-1 block"
                >
                  {isExpandedBrands
                    ? "— Thu gọn"
                    : `+ Xem thêm (${filteredBrands.length - INITIAL_VISIBLE_BRANDS})`}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── KHỐI 3: LỌC THEO MỨC GIÁ ── */}
      <div className="pt-5 border-t border-neutral-200">
        <div className="flex items-center justify-between mb-3">
          <h5 className="font-bold uppercase tracking-wider text-neutral-900 text-xs">
            MỨC GIÁ
          </h5>
          <button
            type="button"
            onClick={() => setOpenPriceSection((prev) => !prev)}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            {openPriceSection ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {openPriceSection && (
          <div className="space-y-2.5">
            {PRICE_RANGES.map((range) => {
              const isChecked = activePriceId === range.id;
              return (
                <label
                  key={range.id}
                  className="flex items-center gap-2.5 cursor-pointer text-xs text-neutral-700 hover:text-neutral-900 transition-colors"
                >
                  <input
                    type="radio"
                    name="priceFilter"
                    checked={isChecked}
                    onChange={() => {
                      onPriceChange(range.min, range.max);
                      onCloseMobile?.();
                    }}
                    className="w-3.5 h-3.5 text-neutral-900 accent-neutral-900 border-neutral-300 focus:ring-0 cursor-pointer"
                  />
                  <span className={isChecked ? "font-bold text-neutral-900" : ""}>
                    {range.label}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* ── DESKTOP SIDEBAR: Phẳng, Tối giản, Sang trọng ── */}
      <aside className="hidden lg:block w-full lg:w-1/4 lg:sticky lg:top-[90px] self-start shrink-0">
        {sidebarContent}
      </aside>

      {/* ── MOBILE DRAWER ── */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          {/* Drawer panel */}
          <div className="relative w-4/5 max-w-sm bg-white h-full overflow-y-auto p-6 shadow-2xl z-10 animate-in slide-in-from-right-8 duration-300">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductSidebar;
