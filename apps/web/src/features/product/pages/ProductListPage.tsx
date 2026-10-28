import React, { useMemo, useState } from "react";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { ProductSidebar } from "../components/ProductSidebar";
import { ProductSort } from "../components/ProductSort";
import { ProductCard } from "../components/ProductCard";
import { ProductSkeleton } from "../components/ProductSkeleton";
import { ProductPagination } from "../components/ProductPagination";
import { useProducts, useBrands, useCategories } from "../hooks/useProduct";
import { useProductFilters } from "../hooks/useProductFilters";

export const ProductListPage: React.FC = () => {
  const { filters, updateFilters, resetFilters } = useProductFilters();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Gọi API danh sách sản phẩm với filters từ URL
  const { data: pageData, isLoading, error } = useProducts(filters);

  // Lấy danh sách danh mục động từ Backend
  const { data: categories = [] } = useCategories();

  // Lấy danh sách thương hiệu cho dropdown và dải pills
  const { data: brands = [] } = useBrands();

  // Tìm đối tượng danh mục thật đang được chọn để lấy tên hiển thị
  const selectedCategory = useMemo(() => {
    const catId = filters.categoryId ?? (filters.category ? Number(filters.category) : undefined);
    if (!catId) return undefined;
    return categories.find((c) => c.idCategory === catId);
  }, [categories, filters.categoryId, filters.category]);

  const selectedCategoryName = selectedCategory?.name;

  // Tìm tên thương hiệu đang được chọn để hiển thị trên breadcrumb
  const selectedBrandName = useMemo(() => {
    if (!filters.brandId) return undefined;
    const found = brands.find((b) => b.idBrand === filters.brandId);
    return found?.name;
  }, [brands, filters.brandId]);

  // Kiểm tra xem có bộ lọc nào đang hoạt động không
  const hasActiveFilters = Boolean(
    filters.categoryId || filters.brandId || filters.minPrice !== undefined || filters.maxPrice !== undefined || filters.search
  );

  // Xây dựng danh sách Breadcrumb động: Trang chủ / Sản phẩm / [Tên Danh Mục Thật] / [Thương hiệu]
  const breadcrumbItems = useMemo<BreadcrumbItem[]>(() => {
    const items: BreadcrumbItem[] = [{ label: "Trang chủ", link: "/" }];

    const hasCategory = Boolean(selectedCategoryName);
    const hasBrand = Boolean(selectedBrandName);

    if (!hasCategory && !hasBrand) {
      items.push({ label: "Sản phẩm" });
    } else {
      items.push({
        label: "Sản phẩm",
        link: "/products",
        onClick: () => {
          updateFilters({ categoryId: undefined, category: undefined, brandId: undefined });
        },
      });

      if (selectedCategoryName) {
        items.push({ label: selectedCategoryName });
      }
      if (selectedBrandName) {
        items.push({ label: `Thương hiệu: ${selectedBrandName}` });
      }
    }

    return items;
  }, [selectedCategoryName, selectedBrandName, updateFilters]);

  const products = pageData?.content || [];
  const totalPages = pageData?.totalPages || 0;
  const totalElements = pageData?.totalElements;

  return (
    <main className="bg-gray-50 min-h-screen py-10 text-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── BREADCRUMB ĐIỀU HƯỚNG ── */}
        <Breadcrumb items={breadcrumbItems} />

        {/* ── THÔNG BÁO LỖI NẾU CÓ ── */}
        {error && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
            ⚠️ Đã xảy ra lỗi khi tải danh mục sản phẩm. Vui lòng thử lại sau.
          </div>
        )}

        {/* ── KHUNG BỐ CỤC 2 CỘT (SIDEBAR VÀ LƯỚI SẢN PHẨM) ── */}
        <div className="flex flex-col lg:flex-row gap-8 mt-4">
          {/* CỘT TRÁI: BỘ LỌC SIDEBAR (DESKTOP STICKY & MOBILE DRAWER) */}
          <ProductSidebar
            categories={categories}
            activeCategoryId={filters.categoryId ?? (filters.category ? Number(filters.category) : undefined)}
            onCategoryChange={(catId) => updateFilters({ categoryId: catId })}
            brands={brands}
            selectedBrandId={filters.brandId}
            onBrandChange={(brandId) => updateFilters({ brandId })}
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            onPriceChange={(min, max) => updateFilters({ minPrice: min, maxPrice: max })}
            isOpenMobile={isMobileFilterOpen}
            onCloseMobile={() => setIsMobileFilterOpen(false)}
          />

          {/* CỘT PHẢI: TOOLBAR + DANH SÁCH SẢN PHẨM + PHÂN TRANG */}
          <div className="w-full lg:w-3/4">
            <ProductSort
              sortBy={filters.sortBy}
              onSortChange={(sortBy) => updateFilters({ sortBy })}
              selectedBrandId={filters.brandId}
              onBrandChange={(brandId) => updateFilters({ brandId })}
              brands={brands}
              totalProducts={totalElements}
              hasActiveFilters={hasActiveFilters}
              onOpenMobileFilter={() => setIsMobileFilterOpen(true)}
            />

            {/* TRẠNG THÁI LOADING */}
            {isLoading ? (
              <ProductSkeleton count={filters.size || 12} />
            ) : products.length === 0 ? (
              /* TRẠNG THÁI RỖNG (EMPTY STATE CHUẨN GIAO DIỆN CŨ) */
              <div className="text-center py-20 w-full bg-white rounded-lg border border-gray-200 shadow-2xs">
                <h5 className="text-gray-500 text-xl font-medium">
                  Không tìm thấy sản phẩm nào
                </h5>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 text-rose-600 underline font-medium cursor-pointer hover:text-rose-700 transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              /* LƯỚI SẢN PHẨM: 2 cột (Mobile) -> 3 cột (Tablet/Laptop) -> 4 cột (Desktop lớn) */
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                {products.map((product) => (
                  <ProductCard key={product.idProduct} product={product} />
                ))}
              </div>
            )}

            {/* THANH PHÂN TRANG CHUẨN SPRING BOOT */}
            {!isLoading && totalPages > 1 && (
              <ProductPagination
                currentPage={filters.page ?? 0}
                totalPages={totalPages}
                onPageChange={(page) => {
                  updateFilters({ page });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductListPage;
