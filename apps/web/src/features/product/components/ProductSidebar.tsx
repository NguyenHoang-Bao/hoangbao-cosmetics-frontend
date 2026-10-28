import React, { useState, useCallback, useMemo } from "react";
import type { Category, Brand } from "@hoangbao/types";
import { ChevronDown, ChevronUp, X, Check, Search, Sparkles, Smile, Palette, Folder } from "lucide-react";

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

// Định nghĩa phân nhóm thông minh cho danh mục mỹ phẩm (Chuẩn Hasaki / Sephora)
interface CategoryGroupConfig {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  slugs: string[];
  keywords: string[];
}

const CATEGORY_GROUP_CONFIGS: CategoryGroupConfig[] = [
  {
    id: "skincare",
    title: "Chăm Sóc Da",
    icon: Sparkles,
    slugs: ["sua-rua-mat", "kem-chong-nang", "tinh-chat", "kem-duong", "tay-trang", "mat-na", "tay-da-chet", "kem-duong-mat"],
    keywords: ["da", "mặt", "mắt", "serum", "dưỡng ẩm", "rửa mặt", "tẩy trang", "chống nắng", "tế bào chết"],
  },
  {
    id: "makeup",
    title: "Trang Điểm (Makeup)",
    icon: Palette,
    slugs: ["son-moi", "cushion", "kem-lot-nen", "phan-phu"],
    keywords: ["son", "cushion", "nền", "lót", "phấn", "makeup", "trang điểm", "má"],
  },
  {
    id: "body_hair",
    title: "Tóc & Toàn Thân",
    icon: Smile,
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
  // Trạng thái đóng/mở Accordion từng nhóm danh mục
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    skincare: true,
    makeup: true,
    body_hair: true,
    others: true,
  });

  // Trạng thái đóng/mở khối Brand và Price
  const [openSections, setOpenSections] = useState({
    brands: true,
    price: true,
  });

  // Tìm kiếm nhanh thương hiệu trong Sidebar
  const [brandSearch, setBrandSearch] = useState("");
  // Xem thêm danh sách thương hiệu
  const [isExpandedBrands, setIsExpandedBrands] = useState(false);

  const toggleGroup = useCallback((groupId: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  }, []);

  const toggleSection = useCallback((section: "brands" | "price") => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
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
    <div className="flex flex-col space-y-6">
      {/* ── HEADER MOBILE DRAWER ── */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200 lg:hidden">
        <h5 className="font-bold uppercase tracking-wide text-gray-900 text-base">
          Bộ Lọc Sản Phẩm
        </h5>
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Đóng bộ lọc"
          className="p-1.5 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* ── 1. DANH MỤC SẢN PHẨM: PHÂN NHÓM CHUYÊN NGHIỆP ── */}
      <div>
        <h5 className="font-bold uppercase tracking-wide text-gray-900 text-sm mb-3">
          DANH MỤC SẢN PHẨM
        </h5>

        {/* Nút xem TẤT CẢ SẢN PHẨM */}
        <button
          type="button"
          onClick={() => {
            onCategoryChange(undefined);
            onCloseMobile?.();
          }}
          className={`w-full text-left px-3.5 py-2.5 rounded-lg font-bold text-xs sm:text-sm transition-all flex items-center justify-between mb-3 border ${
            !activeCategoryId
              ? "bg-rose-50 border-rose-300 text-rose-600 shadow-2xs"
              : "bg-white border-gray-200 text-gray-700 hover:border-rose-200 hover:text-rose-600"
          }`}
        >
          <span>TẤT CẢ SẢN PHẨM</span>
          {!activeCategoryId && <Check className="w-4 h-4 text-rose-600" />}
        </button>

        {/* Các nhóm Accordion Chăm Sóc Da / Trang Điểm / Toàn Thân */}
        <div className="border border-gray-200 bg-white rounded-lg overflow-hidden divide-y divide-gray-100">
          {CATEGORY_GROUP_CONFIGS.map((config) => {
            const items = groupedCategories[config.id] || [];
            if (items.length === 0) return null;

            const isOpen = openGroups[config.id];
            const Icon = config.icon;
            const hasActiveItem = items.some((item) => item.idCategory === activeCategoryId);

            return (
              <div key={config.id} className="transition-colors">
                {/* Header nhóm */}
                <button
                  type="button"
                  onClick={() => toggleGroup(config.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-colors ${
                    hasActiveItem ? "text-rose-600 bg-rose-50/40" : "text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-rose-500" />
                    <span>{config.title}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  )}
                </button>

                {/* Danh sách danh mục con trong nhóm */}
                {isOpen && (
                  <div className="px-3 pb-2.5 pt-1 space-y-0.5 bg-gray-50/50">
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
                          className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-all flex items-center justify-between ${
                            isSelected
                              ? "bg-rose-50 text-rose-600 font-bold"
                              : "text-gray-600 hover:text-rose-600 hover:bg-white"
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

          {/* Nhóm Danh Mục Khác (dành cho danh mục mới tạo từ Admin) */}
          {groupedCategories.others && groupedCategories.others.length > 0 && (
            <div className="transition-colors">
              <button
                type="button"
                onClick={() => toggleGroup("others")}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Folder className="w-3.5 h-3.5 text-rose-500" />
                  <span>Danh Mục Khác</span>
                </span>
                {openGroups.others ? (
                  <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                )}
              </button>

              {openGroups.others && (
                <div className="px-3 pb-2.5 pt-1 space-y-0.5 bg-gray-50/50">
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
                        className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-all flex items-center justify-between ${
                          isSelected
                            ? "bg-rose-50 text-rose-600 font-bold"
                            : "text-gray-600 hover:text-rose-600 hover:bg-white"
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

      {/* ── 2. BỘ LỌC THƯƠNG HIỆU (BRAND) TRÊN CẢ DESKTOP & MOBILE ── */}
      {brands.length > 0 && (
        <div>
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
            <div className="border border-gray-200 bg-white rounded-lg p-3 space-y-2">
              {/* Ô tìm kiếm nhanh thương hiệu */}
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm thương hiệu..."
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-rose-400 text-gray-800 placeholder-gray-400"
                />
              </div>

              {/* Danh sách Checkbox thương hiệu */}
              <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                {/* Lựa chọn Tất cả thương hiệu */}
                {!brandSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      onBrandChange?.(undefined);
                      onCloseMobile?.();
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-md text-xs transition-all flex items-center justify-between ${
                      !selectedBrandId
                        ? "bg-rose-50 text-rose-600 font-bold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-rose-600"
                    }`}
                  >
                    <span>Tất cả thương hiệu</span>
                    {!selectedBrandId && <Check className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                  </button>
                )}

                {displayedBrands.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-2">
                    Không tìm thấy thương hiệu
                  </p>
                ) : (
                  displayedBrands.map((b) => {
                    const isSelected = selectedBrandId === b.idBrand;
                    return (
                      <button
                        key={b.idBrand}
                        type="button"
                        onClick={() => {
                          onBrandChange?.(isSelected ? undefined : b.idBrand);
                          onCloseMobile?.();
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded-md text-xs transition-all flex items-center justify-between ${
                          isSelected
                            ? "bg-rose-50 text-rose-600 font-bold"
                            : "text-gray-600 hover:bg-gray-50 hover:text-rose-600"
                        }`}
                      >
                        <span className="truncate">{b.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Nút Xem thêm / Thu gọn danh sách thương hiệu */}
              {!brandSearch && filteredBrands.length > INITIAL_VISIBLE_BRANDS && (
                <button
                  type="button"
                  onClick={() => setIsExpandedBrands((prev) => !prev)}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium pt-1 block w-full text-left"
                >
                  {isExpandedBrands
                    ? "▲ Thu gọn"
                    : `▼ Xem thêm (+${filteredBrands.length - INITIAL_VISIBLE_BRANDS})`}
                </button>
              )}
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
