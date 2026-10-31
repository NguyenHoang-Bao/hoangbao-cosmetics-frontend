//Service API cho product

import { apiClient } from '@hoangbao/api-client';
import type {
  ApiResponse,
  PageResponse,
  Product,
  Category,
  Brand,
  ProductFilterParams,
  ProductReviewSummary,
} from '@hoangbao/types';

export const productApi = {
    // Lay danh sach san pham co phan trang, tim kiem, loc san pham
    getProducts: async (productFilter?: ProductFilterParams): Promise<PageResponse<Product>> =>{
        // tao doi tuong xai append, delete, get set, sort nay kia
        const query = new URLSearchParams();

        // Gan tham so tim kiem theo tu khoa
        if (productFilter?.search) query.set('keyword', productFilter.search);

        // Xu ly categoryId: chi truyen len server khi la so hop le, tranh loi 400/500 Bad Request
        const catId = productFilter?.categoryId ?? (
            productFilter?.category !== undefined && !isNaN(Number(productFilter.category))
                ? Number(productFilter.category)
                : undefined
        );
        if (catId !== undefined && !isNaN(catId)) {
            query.set('categoryId', String(catId));
        }

        // Xu ly brandId: chi truyen len server khi la so hop le
        if (productFilter?.brandId !== undefined && !isNaN(productFilter.brandId)) {
            query.set('brandId', String(productFilter.brandId));
        }
        if (productFilter?.minPrice !== undefined && !isNaN(productFilter.minPrice)) query.set('minPrice', String(productFilter.minPrice));
        if (productFilter?.maxPrice !== undefined && !isNaN(productFilter.maxPrice)) query.set('maxPrice', String(productFilter.maxPrice));
        if (productFilter?.page !== undefined) query.set('page', String(productFilter.page));
        if (productFilter?.size !== undefined) query.set('size', String(productFilter.size));
        if (productFilter?.sortBy) {
            if (productFilter.sortBy === 'price_asc') {
                query.set('sortBy', 'price');
                query.set('sortDir', 'asc');
            } else if (productFilter.sortBy === 'price_desc') {
                query.set('sortBy', 'price');
                query.set('sortDir', 'desc');
            } else if (productFilter.sortBy === 'newest') {
                query.set('sortBy', 'idProduct');
                query.set('sortDir', 'desc');
            }
        }

        const queryString = query.toString() ? `?${query.toString()}`: '';
        const response = await apiClient.get<any, ApiResponse<PageResponse<Product>>>(
            `/products${queryString}`
        );
        return response.data;
    },

    // Lay chi tiet 1 san pham theo ID
    getProductById: async (id: number): Promise<Product> => {
        const reponse = await apiClient.get<any, ApiResponse<Product>>(`/products/${id}`);
        return reponse.data;
    },

    // Lay tat ca danh muc my pham (hien thi tren sidebar loc)
    getCategories: async (): Promise<Category[]> => {
        const response = await apiClient.get<any, ApiResponse<Category[]>>('/categories');
        return response.data;
    },

    // Alias tuong thich cu getCatgories
    getCatgories: async (): Promise<Category[]> => {
        const response = await apiClient.get<any, ApiResponse<Category[]>>('/categories');
        return response.data;
    },

    // Lay tat ca brand
    getBrands: async (): Promise<Brand[]> => {
        const reponse = await apiClient.get<any, ApiResponse<Brand[]>>('/brands');
        return reponse.data;
    },

    // Lay danh sach danh gia va tong quan danh gia cua san pham
    getProductReviews: async (
        productId: number,
        page = 0,
        size = 10,
    ): Promise<ProductReviewSummary> => {
        const response = await apiClient.get<any, ApiResponse<ProductReviewSummary>>(
            `/reviews/products/${productId}?page=${page}&size=${size}`
        );
        return response.data;
    },
};
