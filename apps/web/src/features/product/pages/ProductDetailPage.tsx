import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, AlertCircle } from "lucide-react";
import type { Product, ProductVariant } from "@hoangbao/types";
import { productApi } from "../api/productApi";
import { ProductGallery } from "../components/ProductGallery";
import { ProductInfo } from "../components/ProductInfo";
import { ProductTabs } from "../components/ProductTabs";
import { RelatedProducts } from "../components/RelatedProducts";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/features/cart/store/cartSlice";

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Scroll len dau trang khi doi san pham
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const productId = Number(id);
  const isValidId = !isNaN(productId) && productId > 0;

  const {
    data: product,
    isLoading,
    error,
  } = useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: () => productApi.getProductById(productId),
    enabled: isValidId,
  });

  // Xu ly them vao gio hang
  const handleAddToCart = (quantity: number, variant?: ProductVariant) => {
    if (!product) return;
    dispatch(addToCart({ product, quantity, variant }));
  };

  // Xu ly mua ngay: them vao gio va chuyen thang sang checkout
  const handleBuyNow = (quantity: number, variant?: ProductVariant) => {
    if (!product) return;
    dispatch(addToCart({ product, quantity, variant }));
    navigate("/checkout");
  };

  // Breadcrumbs dieu huong
  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Sản phẩm", href: "/products" },
    ...(product?.category
      ? [
          {
            label: product.category.name,
            href: `/products?categoryId=${product.category.idCategory}`,
          },
        ]
      : []),
    { label: product?.name || "Chi tiết sản phẩm" },
  ];

  // ── TRƯỜNG HỢP 1: ĐANG TẢI DỮ LIỆU (SKELETON) ──
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="h-6 w-64 bg-neutral-100 rounded mb-6 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="aspect-square bg-neutral-100 rounded-2xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-5 w-24 bg-neutral-100 rounded" />
            <div className="h-9 w-4/5 bg-neutral-100 rounded" />
            <div className="h-5 w-40 bg-neutral-100 rounded" />
            <div className="h-16 w-full bg-neutral-100 rounded-xl" />
            <div className="h-28 w-full bg-neutral-100 rounded-xl" />
            <div className="h-12 w-full bg-neutral-100 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // ── TRƯỜNG HỢP 2: LỖI HOẶC KHÔNG TÌM THẤY SẢN PHẨM ──
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="max-w-md mx-auto bg-neutral-50 border border-neutral-200 rounded-2xl p-8">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-neutral-900 mb-2">
            Không tìm thấy sản phẩm
          </h2>
          <p className="text-sm text-neutral-500 mb-6">
            Sản phẩm này có thể đã ngừng kinh doanh hoặc đường dẫn không chính xác.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại danh mục sản phẩm</span>
          </Link>
        </div>
      </div>
    );
  }

  // Tinh toan giam gia tu variant dau tien
  const firstVariant = product.variants?.[0];
  const price = firstVariant?.price ?? 0;
  const originalPrice = firstVariant?.originalPrice;
  const discountPercent =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  // Thu gom danh sach anh
  const allImages: string[] = [];
  if (product.thumbnail) allImages.push(product.thumbnail);
  if (product.images && Array.isArray(product.images)) {
    product.images.forEach((img) => {
      if (img && !allImages.includes(img)) allImages.push(img);
    });
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* ── BREADCRUMB ── */}
      <Breadcrumb items={breadcrumbItems} />

      {/* ── NỘI DUNG CHÍNH (GALLERY & INFO 2 CỘT) ── */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mt-4">
        {/* Gallery ảnh bên trái */}
        <ProductGallery
          images={allImages}
          name={product.name}
          discountPercent={discountPercent}
          inStock={
            firstVariant?.stockQuantity !== undefined
              ? firstVariant.stockQuantity > 0
              : true
          }
        />

        {/* Thông tin đặt hàng bên phải */}
        <ProductInfo
          product={product}
          discountPercent={discountPercent}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      </div>

      {/* ── TABS THÔNG TIN CHI TIẾT & CHÍNH SÁCH ── */}
      <ProductTabs product={product} />

      {/* ── SẢN PHẨM TƯƠNG TỰ CÙNG DANH MỤC ── */}
      <RelatedProducts
        currentProductId={product.idProduct}
        categoryId={product.category?.idCategory}
        onAddToCart={(p) => dispatch(addToCart({ product: p, quantity: 1 }))}
      />
    </div>
  );
};

export default ProductDetailPage;
