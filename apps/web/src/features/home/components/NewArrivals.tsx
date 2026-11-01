import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { productApi } from "@/features/product/api/productApi";
import { ProductCard } from "@/features/product/components/ProductCard";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/features/cart/store/cartSlice";
import type { Product } from "@hoangbao/types";

interface NewArrivalsProps {
  limit?: number;
}

export const NewArrivals: React.FC<NewArrivalsProps> = ({ limit = 8 }) => {
  const dispatch = useAppDispatch();

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["home-new-arrivals", limit],
    queryFn: () => productApi.getProducts({ sortBy: "newest", size: limit }),
  });

  const productsList = productsData?.content || [];

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({ product, quantity: 1 }));
  };

  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 container mx-auto bg-white">
      <div className="flex justify-between items-end mb-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-rose-500 block mb-1">
            Tuyển Chọn Mới Nhất
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-neutral-900">
            Hàng Mới Về
          </h2>
          <div className="w-16 h-1 bg-rose-500 mt-3 rounded-full" />
        </div>
        <Link
          to="/products"
          className="flex items-center gap-1.5 text-rose-500 hover:text-rose-600 transition-colors uppercase text-xs sm:text-sm font-bold tracking-wider hover:underline underline-offset-4"
        >
          <span>Xem Tất Cả</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(limit)].map((_, i) => (
            <div
              key={i}
              className="h-80 bg-neutral-100 rounded-2xl animate-pulse border border-neutral-100"
            />
          ))}
        </div>
      ) : productsList.length === 0 ? (
        <div className="text-center py-12 text-neutral-400 text-sm">
          Đang cập nhật danh mục sản phẩm mới...
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {productsList.map((product) => (
            <ProductCard
              key={product.idProduct}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default NewArrivals;
