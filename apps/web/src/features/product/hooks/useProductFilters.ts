import type { ProductFilterParams } from "@hoangbao/types";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

// Helper nhỏ: Có giá trị thì set lên URL, rỗng/null thì xóa khỏi URL
const setOrDelete = (params: URLSearchParams, key: string, value: unknown) => {
    if (value !== undefined && value !== null && value !== "") {
        params.set(key, String(value).trim());
    } else {
        params.delete(key);
    }
};

export const useProductFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // 1. Đọc dữ liệu từ URL
    const filters: ProductFilterParams = useMemo(() => {
        const sortByParam = searchParams.get("sortBy");

        // Ép kiểu chuẩn: chỉ nhận 3 giá trị hợp lệ, còn lại về "newest"
        const sortBy: ProductFilterParams["sortBy"] =
            sortByParam === "price_asc" || sortByParam === "price_desc" || sortByParam === "newest"
                ? sortByParam
                : "newest";

        // Đồng bộ đọc categoryId (ưu tiên categoryId, fallback cat)
        const rawCat = searchParams.get("categoryId") || searchParams.get("cat");
        const categoryId = rawCat && !isNaN(Number(rawCat)) ? Number(rawCat) : undefined;

        const rawBrand = searchParams.get("brandId");
        const brandId = rawBrand && !isNaN(Number(rawBrand)) ? Number(rawBrand) : undefined;

        const rawMinPrice = searchParams.get("minPrice");
        const minPrice = rawMinPrice && !isNaN(Number(rawMinPrice)) ? Number(rawMinPrice) : undefined;

        const rawMaxPrice = searchParams.get("maxPrice");
        const maxPrice = rawMaxPrice && !isNaN(Number(rawMaxPrice)) ? Number(rawMaxPrice) : undefined;

        return {
            categoryId,
            category: categoryId !== undefined ? String(categoryId) : undefined,
            brandId,
            minPrice,
            maxPrice,
            search: searchParams.get("search") || undefined,
            page: Number(searchParams.get("page")) || 0,
            size: Number(searchParams.get("size")) || 12,
            sortBy, // Dùng luôn biến sortBy đã chuẩn kiểu ở trên
        };
    }, [searchParams]);

    // 2. Cập nhật URL
    const updateFilters = useCallback(
        (newFilters: Partial<ProductFilterParams>) => {
            setSearchParams(
                (prev) => {
                    const next = new URLSearchParams(prev);

                    // Đồng bộ categoryId lên URL: ?categoryId={number}
                    if ("categoryId" in newFilters) {
                        setOrDelete(next, "categoryId", newFilters.categoryId);
                        next.delete("cat"); // Dọn dẹp param cat cũ nếu có
                    } else if ("category" in newFilters) {
                        const num = Number(newFilters.category);
                        if (!isNaN(num) && newFilters.category !== undefined && newFilters.category !== null && newFilters.category !== "") {
                            setOrDelete(next, "categoryId", num);
                        } else {
                            setOrDelete(next, "categoryId", undefined);
                        }
                        next.delete("cat");
                    }

                    if ("brandId" in newFilters) setOrDelete(next, "brandId", newFilters.brandId);
                    if ("minPrice" in newFilters) setOrDelete(next, "minPrice", newFilters.minPrice);
                    if ("maxPrice" in newFilters) setOrDelete(next, "maxPrice", newFilters.maxPrice);
                    if ("search" in newFilters) setOrDelete(next, "search", newFilters.search);
                    if ("sortBy" in newFilters) setOrDelete(next, "sortBy", newFilters.sortBy);

                    // Xử lý trang: 
                    // Nếu bấm đổi trang -> nhảy đến trang đó.
                    // Nếu đổi bất kỳ bộ lọc nào khác (Danh mục, Thương hiệu, Giá, Tìm kiếm...) -> tự động đá về trang 0 đúng 1 chỗ duy nhất!
                    if (newFilters.page !== undefined) {
                        next.set("page", String(newFilters.page));
                    } else {
                        next.set("page", "0");
                    }

                    return next;
                },
                { replace: true }
            );
        },
        [setSearchParams]
    );

    // 3. Xóa hết bộ lọc
    const resetFilters = useCallback(() => {
        setSearchParams(new URLSearchParams(), { replace: true });
    }, [setSearchParams]);

    return { filters, updateFilters, resetFilters };
};