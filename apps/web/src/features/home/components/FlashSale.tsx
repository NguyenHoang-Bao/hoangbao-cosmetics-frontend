import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ShoppingBag, Flame } from "lucide-react";
import { flashSaleApi } from "../api/flashSaleApi";
import { productApi } from "@/features/product/api/productApi";
import { ProductCard } from "@/features/product/components/ProductCard";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/features/cart/store/cartSlice";
import { formatCurrency, getProductImageUrl } from "@/lib/utils";
import type { Product, FlashSaleItemResponse } from "@hoangbao/types";

export const FlashSale: React.FC = () => {
  const dispatch = useAppDispatch();

  // 1. Lấy dữ liệu chiến dịch Flash Sale đang diễn ra từ Backend API
  const { data: flashSale, isLoading: isLoadingSale } = useQuery({
    queryKey: ["active-flash-sale"],
    queryFn: flashSaleApi.getActiveFlashSale,
    staleTime: 1000 * 60, // Cache 1 phút
  });

  const hasFlashSaleItems = Boolean(
    flashSale && flashSale.status === "ACTIVE" && flashSale.items && flashSale.items.length > 0
  );

  // 2. Query fallback nếu chưa có chiến dịch Flash Sale nào hoạt động trong DB
  const { data: fallbackProductsData, isLoading: isLoadingFallback } = useQuery({
    queryKey: ["home-flash-sale-fallback"],
    queryFn: () => productApi.getProducts({ size: 5, sortBy: "newest" }),
    enabled: !hasFlashSaleItems,
  });

  // 3. Đồng hồ đếm ngược đồng bộ từ Server (Server-Authoritative Countdown)
  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => {
    return flashSale?.remainingSeconds ?? 172800; // Mặc định 48h nếu chưa có dữ liệu
  });

  useEffect(() => {
    if (flashSale?.remainingSeconds !== undefined && flashSale.remainingSeconds > 0) {
      setRemainingSeconds(flashSale.remainingSeconds);
    }
  }, [flashSale?.remainingSeconds]);

  useEffect(() => {
    if (remainingSeconds <= 0) return;
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [remainingSeconds]);

  const days = String(Math.floor(remainingSeconds / 86400)).padStart(2, "0");
  const hours = String(Math.floor((remainingSeconds % 86400) / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((remainingSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(remainingSeconds % 60).padStart(2, "0");

  // Xử lý thêm sản phẩm Flash Sale vào giỏ hàng với giá sale ưu đãi
  const handleAddFlashSaleItemToCart = (item: FlashSaleItemResponse) => {
    const syntheticProduct: Product = {
      idProduct: item.idProduct,
      name: item.productName,
      thumbnail: item.thumbnail || "",
      category: { idCategory: 0, name: item.categoryName || "" },
      brand: { idBrand: 0, name: item.brandName || "Mỹ phẩm chính hãng" },
      description: "",
      images: item.thumbnail ? [item.thumbnail] : [],
      variants: [
        {
          idVariant: item.idVariant,
          sku: item.sku,
          capacity: item.capacity,
          price: item.salePrice,
          originalPrice: item.originalPrice,
          stockQuantity: item.stockQuantity - item.soldQuantity,
        },
      ],
    };

    dispatch(
      addToCart({
        product: syntheticProduct,
        quantity: 1,
        openDrawer: true,
      })
    );
  };

  const handleAddToCartFallback = (product: Product) => {
    dispatch(addToCart({ product, quantity: 1, openDrawer: true }));
  };

  const isLoading = isLoadingSale || (!hasFlashSaleItems && isLoadingFallback);
  const fallbackList = fallbackProductsData?.content || [];

  return (
    <section id="section-flash-sale" className="py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Khung viền sang trọng chuẩn Basic Luxury */}
        <div className="bg-gradient-to-b from-rose-50/60 via-white to-rose-50/30 rounded-3xl p-5 sm:p-8 border border-rose-100/70 shadow-2xs">
          {/* ── HEADER FLASH SALE ── */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8 pb-6 border-b border-rose-100/50">
            {/* Tiêu đề & Subtitle */}
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-rose-100/70 text-rose-700 text-[11px] font-bold uppercase tracking-wider mb-2">
                Ưu Đãi Đặc Quyền Giới Hạn
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-neutral-900 uppercase">
                {flashSale?.title || "Flash Sale Mỹ Phẩm Chính Hãng"}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Sở hữu mỹ phẩm cao cấp với mức giá ưu đãi nhất trong khung giờ vàng
              </p>
            </div>

            {/* Đồng hồ đếm ngược Minimalist Monospace */}
            <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-rose-100 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 hidden sm:inline-block">
                Kết thúc sau:
              </span>
              <div className="flex items-center gap-1.5 font-mono">
                {[
                  { val: days, label: "NGÀY" },
                  { val: hours, label: "GIỜ" },
                  { val: minutes, label: "PHÚT" },
                  { val: seconds, label: "GIÂY" },
                ].map((unit, idx, arr) => (
                  <React.Fragment key={unit.label}>
                    <div className="flex flex-col items-center">
                      <span className="text-base sm:text-lg font-bold text-neutral-900 bg-neutral-50 px-2 py-1 rounded-lg border border-neutral-100 min-w-[34px] text-center">
                        {unit.val}
                      </span>
                      <span className="text-[9px] text-neutral-400 font-semibold tracking-tighter mt-0.5">
                        {unit.label}
                      </span>
                    </div>
                    {idx < arr.length - 1 && (
                      <span className="text-rose-400 font-bold -mt-3.5">:</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* ── LƯỚI SẢN PHẨM FLASH SALE ── */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-80 bg-white rounded-2xl animate-pulse border border-neutral-100"
                />
              ))}
            </div>
          ) : hasFlashSaleItems && flashSale ? (
            /* Hiển thị danh sách sản phẩm từ chiến dịch Flash Sale thật của Backend */
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {flashSale.items.slice(0, 5).map((item) => {
                const imgUrl = item.thumbnail ? getProductImageUrl(item.thumbnail) : "";
                return (
                  <div
                    key={item.idItem}
                    className="flex flex-col justify-between bg-white rounded-2xl p-3 border border-neutral-100 hover:border-rose-200 hover:shadow-md transition-all duration-300 group"
                  >
                    <div>
                      {/* Ảnh & Badge Giảm Giá */}
                      <Link
                        to={`/products/${item.idProduct}`}
                        className="relative block aspect-square rounded-xl overflow-hidden bg-neutral-50 p-2 mb-3"
                      >
                        {item.discountPercent > 0 && (
                          <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold tracking-wider shadow-xs">
                            -{item.discountPercent}%
                          </span>
                        )}
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt={item.productName}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-300">
                            <ShoppingBag className="w-8 h-8" />
                          </div>
                        )}
                      </Link>

                      {/* Thương hiệu */}
                      {item.brandName && (
                        <p className="text-[10px] font-bold uppercase tracking-widest text-rose-500 line-clamp-1 mb-1">
                          {item.brandName}
                        </p>
                      )}

                      {/* Tên sản phẩm */}
                      <Link
                        to={`/products/${item.idProduct}`}
                        className="text-xs sm:text-sm font-semibold text-neutral-800 hover:text-rose-600 line-clamp-2 leading-snug transition-colors min-h-[2.5rem]"
                        title={item.productName}
                      >
                        {item.productName}
                      </Link>

                      {/* Giá bán Flash Sale */}
                      <div className="mt-2.5 flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-sm sm:text-base font-extrabold text-rose-600">
                          {formatCurrency(item.salePrice)}
                        </span>
                        {item.originalPrice > item.salePrice && (
                          <span className="text-[11px] text-neutral-400 line-through">
                            {formatCurrency(item.originalPrice)}
                          </span>
                        )}
                      </div>

                      {/* ── THANH TIẾN ĐỘ XẢ KHO BASIC LUXURY ── */}
                      <div className="mt-3">
                        <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-rose-500 to-amber-400 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.max(5, item.soldPercentage))}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-medium text-neutral-500 mt-1">
                          <span>Đã bán {item.soldQuantity}/{item.stockQuantity}</span>
                          {item.soldPercentage >= 75 && !item.isSoldOut && (
                            <span className="text-amber-600 font-bold flex items-center gap-0.5">
                              <Flame className="w-2.5 h-2.5" /> Sắp cháy hàng
                            </span>
                          )}
                          {item.isSoldOut && (
                            <span className="text-neutral-400 font-bold">Hết suất</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Nút thao tác thêm vào giỏ */}
                    <div className="mt-3 pt-2 border-t border-neutral-50">
                      {item.isSoldOut ? (
                        <button
                          disabled
                          className="w-full py-2 rounded-xl bg-neutral-100 text-neutral-400 text-xs font-semibold cursor-not-allowed"
                        >
                          Hết suất sale
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAddFlashSaleItemToCart(item)}
                          className="w-full py-2 px-3 rounded-xl bg-neutral-900 hover:bg-rose-600 text-white text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-2xs active:scale-98 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Thêm vào giỏ</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Fallback hiển thị sản phẩm thông thường nếu đợt sale đang đóng */
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {fallbackList.slice(0, 5).map((product) => (
                <ProductCard
                  key={product.idProduct}
                  product={product}
                  onAddToCart={handleAddToCartFallback}
                />
              ))}
            </div>
          )}

          {/* ── LINK XEM TẤT CẢ FLASH SALE ── */}
          <div className="mt-8 text-center pt-4 border-t border-rose-100/40">
            <Link
              to="/sale"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-neutral-800 hover:text-rose-600 tracking-wider uppercase transition-colors group"
            >
              <span>Xem tất cả ưu đãi hôm nay</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlashSale;
