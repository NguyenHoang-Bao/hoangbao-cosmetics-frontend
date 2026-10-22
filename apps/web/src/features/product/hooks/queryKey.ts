//quan ly cacheKey cho tanstack query
import type { ProductFilterParams } from "@hoangbao/types";

export const productKeys = {
    // Goc toan bo cache san pham
    all: ['products'] as const,

    // Cache danh sach san pham
    lists: () => [...productKeys.all, 'list'] as const,
    list: (filters?: ProductFilterParams) => [...productKeys.lists(), filters ??{}] as const,

    //Cache chi tiet tung san pham
    details: () => [...productKeys.all, 'detail'] as const,
    detail: (id: number) => [...productKeys.details(), id] as const,

    // Cache danh muc & thuong hieu (du lieu tinh it thay doi)
    categories: ['categories'] as const,
    brands: ['brands'] as const,
}