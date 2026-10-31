import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { favoriteApi } from "../api/favoriteApi";
import type { PageResponse, FavoriteResponse, FavoriteToggleResponse } from "@hoangbao/types";

export const useCheckFavorite = (productId?: number, isAuth = false) => {
  return useQuery<boolean>({
    queryKey: ["favorite-check", productId],
    queryFn: () => favoriteApi.checkIsFavorite(productId!),
    enabled: isAuth && typeof productId === "number" && !isNaN(productId) && productId > 0,
    staleTime: 1000 * 60 * 5,
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation<FavoriteToggleResponse, Error, number>({
    mutationFn: (productId: number) => favoriteApi.toggleFavorite(productId),
    onSuccess: (data) => {
      queryClient.setQueryData(["favorite-check", data.idProduct], data.isFavorite);
      queryClient.invalidateQueries({ queryKey: ["my-favorites"] });
    },
  });
};

export const useMyFavorites = (page = 0, size = 12, isAuth = false) => {
  return useQuery<PageResponse<FavoriteResponse>>({
    queryKey: ["my-favorites", page, size],
    queryFn: () => favoriteApi.getMyFavorites(page, size),
    enabled: isAuth,
  });
};
