import { apiClient } from "@hoangbao/api-client";
import type {
  ApiResponse,
  PageResponse,
  FavoriteResponse,
  FavoriteToggleResponse,
} from "@hoangbao/types";

export const favoriteApi = {
  // Toggle yeu thich san pham (them / xoa)
  toggleFavorite: async (productId: number): Promise<FavoriteToggleResponse> => {
    const response = await apiClient.post<any, ApiResponse<FavoriteToggleResponse>>(
      `/favorites/${productId}`
    );
    return response.data;
  },

  // Lay danh sach san pham yeu thich cua user hien tai
  getMyFavorites: async (
    page = 0,
    size = 12
  ): Promise<PageResponse<FavoriteResponse>> => {
    const response = await apiClient.get<any, ApiResponse<PageResponse<FavoriteResponse>>>(
      `/favorites?page=${page}&size=${size}`
    );
    return response.data;
  },

  // Kiem tra xem san pham da duoc user yeu thich hay chua
  checkIsFavorite: async (productId: number): Promise<boolean> => {
    const response = await apiClient.get<any, ApiResponse<boolean>>(
      `/favorites/check/${productId}`
    );
    return response.data;
  },
};
