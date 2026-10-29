import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import type { Product } from "@hoangbao/types";
import { productApi } from "../api/productApi";
import { ProductCard } from "./ProductCard";

interface RelatedProductsProps {
  currentProductId: number;
  categoryId?: number;
  onAddToCart?: (product: Product) => void;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentProductId,
  categoryId,
  onAddToCart,
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["relatedProducts", categoryId, currentProductId],
    queryFn: () =>
      productApi.getProducts({
        categoryId,
        size: 8,
      }),
    enabled: Boolean(categoryId),
  });

  const relatedList =
    data?.content?.filter((p) => p.idProduct !== currentProductId).slice(0, 4) ||
    [];

  if (!isLoading && relatedList.length === 0) return null;

  return (
    <div className="mt-16 pt-10 border-t border-neutral-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Gợi ý cho bạn
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
            Sản Phẩm Tương Tự
          </h3>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-neutral-100 rounded-xl aspect-[3/4] animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {relatedList.map((product) => (
            <ProductCard
              key={product.idProduct}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};
