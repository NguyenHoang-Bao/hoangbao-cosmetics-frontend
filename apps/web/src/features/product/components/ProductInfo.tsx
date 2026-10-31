import React, { useState, type ChangeEvent } from "react";
import { Star, ShoppingBag, Zap, Heart, Bell, Check, Ban } from "lucide-react";
import type { Product, ProductVariant } from "@hoangbao/types";
import { formatCurrency, parseProductArrayData } from "@/lib/utils";

interface ProductInfoProps {
  product: Product;
  discountPercent?: number;
  averageRating?: number | null;
  totalReviews?: number;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onViewReviews?: () => void;
  onAddToCart: (quantity: number, variant?: ProductVariant) => void;
  onBuyNow: (quantity: number, variant?: ProductVariant) => void;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  discountPercent = 0,
  averageRating,
  totalReviews = 0,
  isFavorite = false,
  onToggleFavorite,
  onViewReviews,
  onAddToCart,
  onBuyNow,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isNotified, setIsNotified] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(() => {
    if (!product.variants || product.variants.length === 0) return undefined;
    const inStockVariant = product.variants.find((v) => (v.stockQuantity ?? 1) > 0);
    return inStockVariant ?? product.variants[0];
  });

  const brandName =
    typeof product.brand === "object" ? product.brand?.name : product.brand;

  // Giá và dung tích tính theo variant được chọn
  const currentPrice = selectedVariant?.price ?? 0;
  const currentOriginalPrice = selectedVariant?.originalPrice;
  const availableStock = selectedVariant?.stockQuantity ?? 99;
  const inStock =
    selectedVariant?.stockQuantity !== undefined
      ? selectedVariant.stockQuantity > 0
      : true;

  const handleSelectVariant = (v: ProductVariant) => {
    setSelectedVariant(v);
    const variantStock = v.stockQuantity ?? 99;
    if (variantStock > 0 && quantity > variantStock) {
      setQuantity(variantStock);
    }
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(availableStock, prev + delta)));
  };

  const handleQuantityInput = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 1) {
      setQuantity(Math.min(availableStock, val));
    } else if (e.target.value === "") {
      setQuantity(1);
    }
  };

  // Tách công dụng an toàn (hỗ trợ cả JSON array từ DB lẫn text xuống dòng)
  const benefitsList = parseProductArrayData(product.benefits);

  return (
    <div className="w-full lg:w-1/2 flex flex-col">
      {/* ── 1. THƯƠNG HIỆU & MÃ SẢN PHẨM ── */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {brandName && (
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">
            {brandName}
          </span>
        )}
        {selectedVariant?.sku && (
          <span className="text-xs text-neutral-400 font-mono">
            · Mã SP: {selectedVariant.sku}
          </span>
        )}
      </div>

      {/* ── 2. TÊN SẢN PHẨM & NÚT THẢ TIM YÊU THÍCH ── */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 leading-snug">
          {product.name}
        </h1>
        {onToggleFavorite && (
          <button
            type="button"
            onClick={onToggleFavorite}
            className={`p-2.5 rounded-2xl border transition-all cursor-pointer shrink-0 ${
              isFavorite
                ? "bg-rose-50 border-rose-200 text-rose-500 shadow-xs"
                : "bg-white border-neutral-200 text-neutral-400 hover:text-rose-500 hover:border-rose-200"
            }`}
            title={isFavorite ? "Đã lưu vào yêu thích" : "Thêm vào danh sách yêu thích"}
            aria-label="Yêu thích"
          >
            <Heart
              className={`w-5 h-5 transition-transform active:scale-75 ${
                isFavorite ? "fill-rose-500" : ""
              }`}
            />
          </button>
        )}
      </div>

      {/* ── 3. ĐÁNH GIÁ THỰC TẾ (TỪ API, KHÔNG HARDCODE) ── */}
      <div className="flex items-center gap-2 mb-5 text-xs sm:text-sm">
        {totalReviews > 0 ? (
          <>
            <div className="flex items-center text-amber-500 font-semibold gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-neutral-900 font-bold">
                {averageRating ? averageRating.toFixed(1) : "5.0"}
              </span>
            </div>
            <span className="text-neutral-300">·</span>
            <button
              type="button"
              onClick={onViewReviews}
              className="text-neutral-500 hover:text-rose-600 transition-colors cursor-pointer underline-offset-4 hover:underline"
            >
              {totalReviews} đánh giá
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <Star className="w-3.5 h-3.5 text-neutral-300" />
            <span>Chưa có đánh giá</span>
            <span className="text-neutral-300">·</span>
            <button
              type="button"
              onClick={onViewReviews}
              className="hover:text-rose-600 transition-colors underline-offset-4 hover:underline cursor-pointer"
            >
              Gửi nhận xét đầu tiên
            </button>
          </div>
        )}
      </div>

      {/* ── 4. KHỐI HIỂN THỊ GIÁ BÁN ── */}
      <div className="bg-neutral-50 p-4 sm:p-5 rounded-2xl border border-neutral-100 mb-6 flex flex-wrap items-baseline gap-3">
        <span className="text-3xl font-extrabold text-neutral-900 tracking-tight">
          {formatCurrency(currentPrice)}
        </span>
        {currentOriginalPrice && currentOriginalPrice > currentPrice && (
          <span className="text-base text-neutral-400 line-through">
            {formatCurrency(currentOriginalPrice)}
          </span>
        )}
        {discountPercent > 0 && (
          <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
            Tiết kiệm {discountPercent}%
          </span>
        )}
      </div>

      {/* ── 5. CHỌN BIẾN THỂ (DUNG TÍCH / MÀU SẮC) ── */}
      {product.variants && product.variants.length > 1 && (
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2.5">
            Phân loại:
          </label>
          <div className="flex flex-wrap gap-2.5">
            {product.variants.map((v) => {
              const isSelected = selectedVariant?.idVariant === v.idVariant;
              const label = v.capacity || v.volume || v.shade || v.sku;
              const isVariantOutOfStock = v.stockQuantity !== undefined && v.stockQuantity <= 0;
              return (
                <button
                  key={v.idVariant}
                  type="button"
                  onClick={() => handleSelectVariant(v)}
                  className={`relative px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "border-neutral-900 bg-neutral-900 text-white shadow-xs"
                      : isVariantOutOfStock
                      ? "border-neutral-200 bg-neutral-50/70 text-neutral-400 hover:border-neutral-300"
                      : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                  }`}
                >
                  <span className={isVariantOutOfStock && !isSelected ? "line-through opacity-70" : ""}>
                    {label} - {formatCurrency(v.price)}
                  </span>
                  {isVariantOutOfStock && (
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-neutral-200 text-neutral-500"
                      }`}
                    >
                      Hết
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 6. TÓM TẮT CÔNG DỤNG CHÍNH ── */}
      {benefitsList.length > 0 && (
        <div className="mb-6 pt-4 border-t border-neutral-100">
          <h4 className="text-xs uppercase font-bold text-neutral-900 tracking-wider mb-2.5">
            Công dụng nổi bật:
          </h4>
          <ul className="space-y-1.5 text-xs sm:text-sm text-neutral-600">
            {benefitsList.slice(0, 3).map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-500 font-bold select-none leading-relaxed">—</span>
                <span className="leading-relaxed">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── 7. CHỌN SỐ LƯỢNG ── */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
            Số lượng:
          </label>
          <div className="flex items-center gap-2">
            {inStock && availableStock <= 5 && (
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                Chỉ còn {availableStock} sản phẩm
              </span>
            )}
            {inStock ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Còn hàng
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                Tạm hết hàng
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center border rounded-lg overflow-hidden transition-colors ${
              inStock
                ? "border-neutral-200 bg-white shadow-2xs"
                : "border-neutral-200 bg-neutral-100 opacity-60 cursor-not-allowed"
            }`}
          >
            <button
              type="button"
              disabled={!inStock || quantity <= 1}
              onClick={() => handleQuantityChange(-1)}
              className="w-10 h-10 flex items-center justify-center text-base font-bold text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Giảm 1"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              max={availableStock}
              disabled={!inStock}
              value={quantity}
              onChange={handleQuantityInput}
              className="w-12 h-10 text-center text-sm font-semibold border-x border-neutral-200 focus:outline-none disabled:bg-neutral-100 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              disabled={!inStock || quantity >= availableStock}
              onClick={() => handleQuantityChange(1)}
              className="w-10 h-10 flex items-center justify-center text-base font-bold text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Tăng 1"
              title={quantity >= availableStock ? `Tối đa ${availableStock} sản phẩm` : "Tăng 1"}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* ── 8. CỤM NÚT MUA HÀNG ── */}
      {inStock ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onAddToCart(quantity, selectedVariant)}
            className="w-full bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 font-bold py-3.5 px-4 rounded-xl uppercase tracking-wider transition-all flex justify-center items-center gap-2 text-xs sm:text-sm shadow-2xs cursor-pointer active:scale-[0.99]"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Thêm Vào Giỏ</span>
          </button>
          <button
            type="button"
            onClick={() => onBuyNow(quantity, selectedVariant)}
            className="w-full bg-neutral-900 hover:bg-rose-600 text-white font-bold py-3.5 px-4 rounded-xl uppercase tracking-wider transition-all flex justify-center items-center gap-2 text-xs sm:text-sm shadow-md cursor-pointer active:scale-[0.99]"
          >
            <Zap className="w-4 h-4" />
            <span>Mua Ngay</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <button
            type="button"
            disabled
            className="w-full bg-neutral-100 border border-neutral-200 text-neutral-400 font-bold py-3.5 px-4 rounded-xl uppercase tracking-wider flex justify-center items-center gap-2 text-xs sm:text-sm cursor-not-allowed shadow-none"
          >
            <Ban className="w-4 h-4 text-neutral-400" />
            <span>Tạm Hết Hàng</span>
          </button>
          <button
            type="button"
            onClick={() => setIsNotified((prev) => !prev)}
            className={`w-full py-3 px-4 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isNotified
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300"
            }`}
          >
            {isNotified ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Đã đăng ký nhận thông báo khi có hàng lại</span>
              </>
            ) : (
              <>
                <Bell className="w-4 h-4 text-rose-500" />
                <span>Thông báo cho tôi khi có hàng</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
