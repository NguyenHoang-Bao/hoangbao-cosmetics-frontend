import type { ProductFilterParams } from "@hoangbao/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { productApi } from "../api/productApi";
import { productKeys } from "./queryKey";

//hook get danh sach sp, filter, search, pagination
export const useProducts = (filters?: ProductFilterParams) => {
    return useQuery({
        //Thay doi filter, queryKey thay doi -> fetch lai dung du lieu
        queryKey: productKeys.list(filters),
        //Goi API backend
        queryFn: () => productApi.getProducts(filters),
        placeholderData: keepPreviousData,
        staleTime: 2 * 60 * 1000,

    });
};

//hook get 1 product by id
export const useProductDetail = (id?: number) => {
    return useQuery({
        queryKey: productKeys.detail(id ?? 0),
        queryFn: () => productApi.getProductById(id!),
        enabled: !!id,   //chỉ fetch khi có id
        staleTime: 5 * 60 * 1000, //5 phut
    });
};

//hook get all danh muc 
export const useCategories = () => {
    return useQuery({
        queryKey: productKeys.categories,
        queryFn: () => productApi.getCatgories(),
        staleTime: 60 * 60 * 1000, //1 gio
    });
};

//hook get all thuong hieu
export const useBrands = () => {
    return useQuery({
        queryKey: productKeys.brands,
        queryFn: () => productApi.getBrands(),
        staleTime: 60 * 60 * 1000, //1 gio
    });
};
