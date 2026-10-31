import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, ArrowLeft, Trash2, LogIn } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { useMyFavorites, useToggleFavorite } from "../hooks/useFavorite";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { formatCurrency, getProductImageUrl } from "@/lib/utils";

export const WishlistPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const { data: favoritesData, isLoading } = useMyFavorites(page, 12, isAuthenticated);
  const toggleFavoriteMutation = useToggleFavorite();

  const breadcrumbItems = [
    { label: "Trang chủ", link: "/" },
    { label: "Sản phẩm yêu thích" },
  ];

  const handleRemoveFavorite = (productId: number) => {
    toggleFavoriteMutation.mutate(productId);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-[70vh]">
      {/* ── BREADCRUMB ── */}
      <Breadcrumb items={breadcrumbItems} />

      {/* ── TIÊU ĐỀ TRANG ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 mb-8 pb-4 border-b border-neutral-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight flex items-center gap-2.5">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <span>Sản Phẩm Yêu Thích</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Lưu giữ các sản phẩm làm đẹp bạn quan tâm để dễ dàng theo dõi và mua sắm.
          </p>
        </div>

        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-rose-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Tiếp tục mua sắm</span>
        </Link>
      </div>

      {/* ── TRƯỜNG HỢP CHƯA ĐĂNG NHẬP ── */}
      {!isAuthenticated ? (
        <div className="max-w-md mx-auto text-center py-16 px-6 bg-neutral-50 rounded-3xl border border-neutral-200/80 my-8">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-neutral-900 mb-2">
            Đăng nhập để xem danh sách yêu thích
          </h2>
          <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
            Hãy đăng nhập tài khoản Hoàng Bảo Cosmetics để đồng bộ và lưu lại các sản phẩm yêu thích trên mọi thiết bị.
          </p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 hover:bg-rose-600 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Đăng nhập ngay</span>
          </button>
        </div>
      ) : isLoading ? (
        /* SKELETON LOADING */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-neutral-100 rounded-2xl h-80" />
          ))}
        </div>
      ) : !favoritesData?.content || favoritesData.content.length === 0 ? (
        /* DANH SÁCH RỖNG */
        <div className="max-w-md mx-auto text-center py-16 px-6 bg-neutral-50 rounded-3xl border border-neutral-200/80 my-8">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900 mb-2">
            Danh sách yêu thích đang trống
          </h3>
          <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
            Bạn chưa lưu sản phẩm nào. Hãy bấm vào biểu tượng trái tim ở từng sản phẩm để lưu lại tại đây!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
          >
            Khám phá sản phẩm ngay
          </Link>
        </div>
      ) : (
        /* LƯỚI SẢN PHẨM YÊU THÍCH */
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {favoritesData.content.map((item) => {
              const itemImg = getProductImageUrl(item.thumbnail);
              return (
                <div
                  key={item.idProduct}
                  className="group relative bg-white border border-neutral-200/80 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  {/* Nút xóa khỏi yêu thích */}
                  <button
                    type="button"
                    onClick={() => handleRemoveFavorite(item.idProduct)}
                    className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-neutral-400 hover:text-rose-500 hover:bg-white shadow-xs flex items-center justify-center transition-all cursor-pointer"
                    title="Xóa khỏi yêu thích"
                    aria-label="Xóa khỏi yêu thích"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Ảnh sản phẩm */}
                  <Link
                    to={`/products/${item.idProduct}`}
                    className="aspect-square bg-neutral-50 overflow-hidden block"
                  >
                    <img
                      src={itemImg}
                      alt={item.productName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </Link>

                  {/* Thông tin sản phẩm */}
                  <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {item.brandName && (
                        <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider mb-1 line-clamp-1">
                          {item.brandName}
                        </p>
                      )}
                      <Link
                        to={`/products/${item.idProduct}`}
                        className="text-xs sm:text-sm font-semibold text-neutral-800 hover:text-rose-600 transition-colors line-clamp-2 leading-snug mb-2"
                      >
                        {item.productName}
                      </Link>
                    </div>

                    <div className="mt-2 pt-2 border-t border-neutral-100 flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-neutral-900">
                        {formatCurrency(item.minPrice || 0)}
                      </span>

                      <Link
                        to={`/product/${item.idProduct}`}
                        className="py-1.5 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                        title="Xem chi tiết để chọn phân loại"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Chọn mua</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PHÂN TRANG NẾU CÓ */}
          {favoritesData.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8 pt-4">
              {[...Array(favoritesData.totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPage(idx)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    page === idx
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
