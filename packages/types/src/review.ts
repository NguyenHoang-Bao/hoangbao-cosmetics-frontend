import type { PageResponse } from "./common";

export interface Review {
  idReview: number;
  idProduct: number;
  productName?: string;
  idUser: number;
  userFullName?: string;
  userAvatar?: string;
  idOrderDetail?: number;
  ratingPoint: number;
  content?: string;
  createdAt?: string;
}

export interface ProductReviewSummary {
  productId: number;
  averageRating: number | null;
  totalReviews: number;
  reviews: PageResponse<Review>;
}
