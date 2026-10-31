export interface FavoriteResponse {
  idProduct: number;
  productName: string;
  thumbnail?: string;
  categoryName?: string;
  brandName?: string;
  minPrice?: number;
  favoritedAt?: string;
}

export interface FavoriteToggleResponse {
  idProduct: number;
  isFavorite: boolean;
  message: string;
}
