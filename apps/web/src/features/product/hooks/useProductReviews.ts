import { useQuery } from "@tanstack/react-query";
import { productApi } from "../api/productApi";
import type { ProductReviewSummary } from "@hoangbao/types";

export const useProductReviews = (
  productId?: number,
  page = 0,
  size = 10,
) => {
  return useQuery<ProductReviewSummary>({
    queryKey: ["product-reviews", productId, page, size],
    queryFn: () => productApi.getProductReviews(productId!, page, size),
    enabled: typeof productId === "number" && !isNaN(productId) && productId > 0,
    staleTime: 1000 * 60 * 5, // 5 phut
  });
};
