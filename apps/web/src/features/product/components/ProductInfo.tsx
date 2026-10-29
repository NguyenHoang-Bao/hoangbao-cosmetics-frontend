import React, { useState, type ChangeEvent } from "react";
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  Zap,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import type { Product, ProductVariant } from "@hoangbao/types";
import { formatCurrency } from "@/lib/utils";

interface ProductInfoProps {
  product: Product;
  discountPercent?: number;
  onAddToCart: (quantity: number, variant?: ProductVariant) => void;
  onBuyNow: (quantity: number, variant?: ProductVariant) => void;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  discountPercent = 0,
  onAddToCart,
  onBuyNow,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants?.[0],
  );

  const brandName =
    typeof product.brand === "object" ? product.brand?.name : product.brand;

  // Giá và dung tích tính theo variant được chọn
  const currentPrice = selectedVariant?.price ?? 0;
  const currentOriginalPrice = selectedVariant?.originalPrice;
  const inStock =
    selectedVariant?.stockQuantity !== undefined
      ? selectedVariant.stockQuantity > 0
      : true;

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(99, prev + delta)));
  };

  const handleQuantityInput = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 1) {
      setQuantity(Math.min(99, val));
    } else if (e.target.value === "") {
      setQuantity(1);
    }
  };

  // Tách công dụng thành danh sách gạch đầu dòng nếu có
  const benefitsList = product.benefits
    ? product.benefits
        .split("\n")
        .map((b) => b.replace(/^[•\-*]\s*/, "").trim())
        .filter(Boolean)
    : [];

  return (
    <div className="w-full lg:w-1/2 flex flex-col">
      {/* ── 1. THƯƠNG HIỆU & MÃ SẢN PHẨM ── */}
      <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
        {brandName && (
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            {brandName}
          </span>
        )}
        {selectedVariant?.sku && (
          <span className="text-xs text-neutral-400 font-mono">
            Mã SP: {selectedVariant.sku}
          </span>
        )}
      </div>

      {/* ── 2. TÊN SẢN PHẨM ── */}
      <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 leading-snug mb-3">
        {product.name}
      </h1>

      {/* ── 3. ĐÁNH GIÁ SAO & UY TÍN ── */}
      <div className="flex flex-wrap items-center gap-2.5 mb-5 text-xs sm:text-sm">
        <div className="flex text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <span className="font-bold text-neutral-900">5.0</span>
        <span className="text-neutral-300">|</span>
        <span className="text-neutral-500 hover:text-rose-600 cursor-pointer">
          128 đánh giá
        </span>
        <span className="text-neutral-300">|</span>
        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium text-xs border border-emerald-200">
          Chính hãng 100%
        </span>
      </div>

      {/* ── 4. KHỐI HIỂN THỊ GIÁ BÁN ── */}
      <div className="bg-rose-50/50 p-4 sm:p-5 rounded-2xl border border-rose-100 mb-6 flex flex-wrap items-baseline gap-3">
        <span className="text-3xl font-extrabold text-rose-600 tracking-tight">
          {formatCurrency(currentPrice)}
        </span>
        {currentOriginalPrice && currentOriginalPrice > currentPrice && (
          <span className="text-base text-neutral-400 line-through">
            {formatCurrency(currentOriginalPrice)}
          </span>
        )}
        {discountPercent > 0 && (
          <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full">
            Tiết kiệm {discountPercent}%
          </span>
        )}
      </div>

      {/* ── 5. CHỌN BIẾN THỂ (DUNG TÍCH / MÀU SẮC) ── */}
      {product.variants && product.variants.length > 1 && (
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2.5">
            Phân loại / Dung tích:
          </label>
          <div className="flex flex-wrap gap-2.5">
            {product.variants.map((v) => {
              const isSelected = selectedVariant?.idVariant === v.idVariant;
              const label = v.capacity || v.volume || v.shade || v.sku;
              return (
                <button
                  key={v.idVariant}
                  type="button"
                  onClick={() => setSelectedVariant(v)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border cursor-pointer ${
                    isSelected
                      ? "border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-200"
                      : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                  }`}
                >
                  {label} - {formatCurrency(v.price)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 6. TÓM TẮT HIỆU QUẢ NỔI BẬT ── */}
      {benefitsList.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-neutral-50/80 border border-neutral-200/80">
          <h4 className="text-xs uppercase font-bold text-neutral-800 tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Hiệu quả nổi bật:</span>
          </h4>
          <ul className="space-y-1.5 text-xs sm:text-sm text-neutral-600">
            {benefitsList.slice(0, 3).map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── 7. CHỌN SỐ LƯỢNG ── */}
      <div className="mb-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
          Số lượng:
        </label>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden bg-white shadow-2xs">
            <button
              type="button"
              onClick={() => handleQuantityChange(-1)}
              className="w-10 h-10 flex items-center justify-center text-base font-bold text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
              aria-label="Giảm 1"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              max="99"
              value={quantity}
              onChange={handleQuantityInput}
              className="w-12 h-10 text-center text-sm font-semibold border-x border-neutral-200 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleQuantityChange(1)}
              className="w-10 h-10 flex items-center justify-center text-base font-bold text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
              aria-label="Tăng 1"
            >
              +
            </button>
          </div>
          <span className="text-xs text-neutral-500">
            ({inStock ? "Còn sẵn hàng trong kho" : "Tạm hết hàng"})
          </span>
        </div>
      </div>

      {/* ── 8. CỤM NÚT MUA HÀNG ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          disabled={!inStock}
          onClick={() => onAddToCart(quantity, selectedVariant)}
          className="w-full bg-rose-50 hover:bg-rose-100 disabled:opacity-50 text-rose-600 border border-rose-300 font-bold py-3.5 px-4 rounded-xl uppercase tracking-wider transition-all flex justify-center items-center gap-2 text-sm shadow-xs cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Thêm Vào Giỏ</span>
        </button>
        <button
          type="button"
          disabled={!inStock}
          onClick={() => onBuyNow(quantity, selectedVariant)}
          className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl uppercase tracking-wider transition-all flex justify-center items-center gap-2 text-sm shadow-md shadow-rose-200 cursor-pointer"
        >
          <Zap className="w-4 h-4" />
          <span>Mua Ngay</span>
        </button>
      </div>

      {/* ── 9. CAM KẾT CHÍNH HÃNG ── */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-neutral-200 text-center">
        <div className="p-2">
          <ShieldCheck className="w-5 h-5 text-rose-500 mx-auto mb-1" />
          <p className="text-[11px] font-semibold text-neutral-800">100% Chính Hãng</p>
        </div>
        <div className="p-2 border-x border-neutral-100">
          <Truck className="w-5 h-5 text-rose-500 mx-auto mb-1" />
          <p className="text-[11px] font-semibold text-neutral-800">Giao Toàn Quốc</p>
        </div>
        <div className="p-2">
          <RotateCcw className="w-5 h-5 text-rose-500 mx-auto mb-1" />
          <p className="text-[11px] font-semibold text-neutral-800">Đổi Trả 7 Ngày</p>
        </div>
      </div>
    </div>
  );
};
