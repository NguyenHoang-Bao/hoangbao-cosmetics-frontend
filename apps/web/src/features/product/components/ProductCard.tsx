import type { Product } from "@hoangbao/types";
import { Heart, ShoppingBag } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { DEFAULT_PRODUCT_IMAGE, formatCurrency, getProductImageUrl } from "@/lib/utils";

export interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onAddToCart,
}) => {
    const [isLiked, setIsLiked] = useState(false);

    // 1. Dong bo neu khong phai idProduct thi lay id fallback
    const productId = product.idProduct ?? (product as unknown as { id?: string | number }).id;

    // 2. Trich xuat gia tu bien the dau tien (hoac fallback neu backend tra truc tiep)
    const firstVariant = product.variants?.[0];
    const price =
        firstVariant?.price ??
        (product as unknown as { price?: number }).price ??
        0;
    const originalPrice =
        firstVariant?.originalPrice ??
        (product as unknown as { originalPrice?: number }).originalPrice;

    // Tinh % giam gia neu co gia goc lon hon gia ban
    const hasDiscount = Boolean(originalPrice && originalPrice > price);
    const discountPercent =
        hasDiscount && originalPrice
            ? Math.round(((originalPrice - price) / originalPrice) * 100)
            : 0;

    // Kiem tra con hang hay khong
    const isOutOfStock =
        firstVariant?.stockQuantity === 0 ||
        (product as unknown as { inStock?: boolean }).inStock === false;

    // 3. Xu ly anh: anh chinh (primary) va anh thu 2 (secondary) khi hover
    const primarySrc = product.thumbnail || product.images?.[0];
    const primaryImg = getProductImageUrl(primarySrc);
    const secondarySrc = product.images?.find((img) => Boolean(img) && img !== primarySrc);
    const secondImg = secondarySrc ? getProductImageUrl(secondarySrc) : null;

    // Ten thuong hieu (ho tro ca string lan object { id, name })
    const brandName =
        typeof product.brand === "object" ? product.brand?.name : product.brand;

    // Handler them vao gio hang dung chung
    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isOutOfStock) {
            onAddToCart?.(product);
        }
    };

    return (
        <div className="group relative bg-white rounded-xl border border-neutral-200/80 hover:border-rose-300 hover:shadow-xl hover:shadow-rose-500/5 transition-all duration-300 flex flex-col overflow-hidden">
            {/* ── 1. KHUNG ANH (TY LE 3/4) & BADGES ── */}
            <div className="relative aspect-[3/4] w-full bg-neutral-100 overflow-hidden shrink-0">
                {/* Link boc anh san pham (chuyen huong khi click vao anh) */}
                <Link
                    to={`/product/${productId}`}
                    className="absolute inset-0 block"
                    aria-label={product.name}
                >
                    {/* Anh chinh */}
                    <img
                        src={primaryImg}
                        alt={product.name}
                        className={`w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105 ${
                            secondImg ? "group-hover:opacity-0" : ""
                        }`}
                        loading="lazy"
                        onError={(e) => {
                            const target = e.currentTarget;
                            if (target.src !== DEFAULT_PRODUCT_IMAGE) {
                                target.src = DEFAULT_PRODUCT_IMAGE;
                            }
                        }}
                    />
                    {/* Anh thu 2: Chi xuat hien muot ma khi hover */}
                    {secondImg && (
                        <img
                            src={secondImg}
                            alt={`${product.name} - ảnh phụ`}
                            className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out opacity-0 group-hover:opacity-100 group-hover:scale-105"
                            loading="lazy"
                            onError={(e) => {
                                const target = e.currentTarget;
                                if (target.src !== DEFAULT_PRODUCT_IMAGE) {
                                target.src = DEFAULT_PRODUCT_IMAGE;
                            }
                        }}
                    />
                )}
                </Link>

                {/* Badge Giam gia */}
                {hasDiscount && (
                    <div className="pointer-events-none absolute top-2.5 left-2.5 z-10 bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        -{discountPercent}%
                    </div>
                )}

                {/* Badge Het hang */}
                {isOutOfStock && (
                    <div className="pointer-events-none absolute inset-0 z-10 bg-neutral-900/40 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-white/95 text-neutral-800 text-xs font-bold px-3 py-1.5 rounded-md shadow-md uppercase tracking-wider">
                            Hết hàng
                        </span>
                    </div>
                )}

                {/* Nut Yeu Thich (Trai tim) o goc tren phai */}
                <button
                    type="button"
                    onClick={() => setIsLiked((prev) => !prev)}
                    aria-label={isLiked ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
                    aria-pressed={isLiked}
                    className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-neutral-600 hover:text-rose-500 shadow-sm flex items-center justify-center transition-transform active:scale-90"
                >
                    <Heart
                        className={`w-4 h-4 transition-colors ${
                            isLiked ? "fill-rose-500 text-rose-500" : ""
                        }`}
                    />
                </button>

                {/* Nut Them Gio Hang Nhanh - DESKTOP ONLY (Truot tu day anh len khi hover) */}
                {!isOutOfStock && (
                    <div className="hidden md:block absolute bottom-2.5 inset-x-2.5 z-10 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            className="w-full py-2 px-3 bg-neutral-900/90 hover:bg-rose-600 text-white text-xs font-semibold rounded-lg shadow-md flex items-center justify-center gap-1.5 backdrop-blur-xs transition-colors cursor-pointer"
                        >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Thêm vào giỏ</span>
                        </button>
                    </div>
                )}
            </div>

            {/* ── 2. THONG TIN SAN PHAM ── */}
            <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-2">
                <div>
                    {/* Thuong hieu */}
                    {brandName && (
                        <p className="text-[11px] font-semibold text-rose-500 uppercase tracking-wider truncate mb-1">
                            {brandName}
                        </p>
                    )}
                    {/* Ten san pham */}
                    <Link
                        to={`/product/${productId}`}
                        className="text-xs sm:text-sm font-medium text-neutral-800 hover:text-rose-600 transition-colors line-clamp-2 leading-snug"
                        title={product.name}
                    >
                        {product.name}
                    </Link>
                </div>

                {/* ── Hang Gia Tien & Nut Mua Mobile ── */}
                <div className="pt-1 mt-auto flex items-center justify-between gap-2">
                    {/* Cum Gia */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2">
                        <span className="text-sm sm:text-base font-bold text-rose-600">
                            {formatCurrency(price)}
                        </span>
                        {hasDiscount && originalPrice && (
                            <span className="text-[11px] sm:text-xs text-neutral-400 line-through">
                                {formatCurrency(originalPrice)}
                            </span>
                        )}
                    </div>

                    {/* Nut Them Gio Hang Nhanh - MOBILE ONLY (Icon tron ben canh gia) */}
                    {!isOutOfStock && (
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            aria-label="Thêm vào giỏ hàng"
                            className="md:hidden shrink-0 w-8 h-8 rounded-full bg-rose-50 active:bg-rose-600 text-rose-600 active:text-white flex items-center justify-center transition-colors shadow-xs active:scale-95 cursor-pointer"
                        >
                            <ShoppingBag className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};