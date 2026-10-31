import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, AlertCircle } from "lucide-react";
import type { Product, ProductVariant } from "@hoangbao/types";
import { productApi } from "../api/productApi";
import { useProductReviews } from "../hooks/useProductReviews";
import { useCheckFavorite, useToggleFavorite } from "../hooks/useFavorite";
import { ProductGallery } from "../components/ProductGallery";
import { ProductInfo } from "../components/ProductInfo";
import { ProductTabs } from "../components/ProductTabs";
import { RelatedProducts } from "../components/RelatedProducts";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/features/cart/store/cartSlice";

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState<
    "benefits" | "ingredients" | "usage" | "reviews"
  >("benefits");

  // Scroll len dau trang khi doi san pham
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveTab("benefits");
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

  // Lay danh gia thuc te cua san pham tu API
  const { data: reviewsSummary } = useProductReviews(productId);

  // Kiem tra va toggle yeu thich san pham
  const { data: isFavorite } = useCheckFavorite(productId, isAuthenticated);
  const toggleFavoriteMutation = useToggleFavorite();

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    toggleFavoriteMutation.mutate(productId);
  };

  const handleViewReviews = () => {
    setActiveTab("reviews");
    const tabsEl = document.getElementById("product-tabs");
    if (tabsEl) {
      tabsEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Xu ly them vao gio hang
  const handleAddToCart = (quantity: number, variant?: ProductVariant) => {
    if (!product) return;
    const isVariantInStock = variant?.stockQuantity !== undefined ? variant.stockQuantity > 0 : true;
    if (!isVariantInStock) return;
    dispatch(addToCart({ product, quantity, variant }));
  };

  // Xu ly mua ngay: them vao gio va chuyen thang sang checkout
  const handleBuyNow = (quantity: number, variant?: ProductVariant) => {
    if (!product) return;
    const isVariantInStock = variant?.stockQuantity !== undefined ? variant.stockQuantity > 0 : true;
    if (!isVariantInStock) return;
    dispatch(addToCart({ product, quantity, variant }));
    navigate("/checkout");
  };

  // Breadcrumbs dieu huong
  const breadcrumbItems = [
    { label: "Trang chủ", link: "/" },
    { label: "Sản phẩm", link: "/products" },
    ...(product?.category
      ? [
          {
            label: product.category.name,
            link: `/products?categoryId=${product.category.idCategory}`,
          },
        ]
      : []),
    { label: product?.name || "Chi tiết sản phẩm" },
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-pulse space-y-8">
          <div className="h-6 w-48 bg-neutral-200 rounded-md" />
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="w-full lg:w-1/2 aspect-square bg-neutral-200 rounded-2xl" />
            <div className="w-full lg:w-1/2 space-y-4">
              <div className="h-4 w-24 bg-neutral-200 rounded" />
              <div className="h-8 w-3/4 bg-neutral-200 rounded" />
              <div className="h-10 w-40 bg-neutral-200 rounded" />
              <div className="h-32 w-full bg-neutral-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-neutral-800 mb-2">
            Không tìm thấy sản phẩm
          </h2>
          <p className="text-sm text-neutral-500 mb-6">
            Sản phẩm bạn đang tìm kiếm có thể đã bị gỡ hoặc đường dẫn không đúng.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-rose-500 text-white rounded-xl text-sm font-semibold transition-colors"
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

        {/* Thông tin đặt hàng bên phải (không icon AI thừa thãi, có thả tim, đánh giá thật từ API) */}
        <ProductInfo
          product={product}
          discountPercent={discountPercent}
          averageRating={reviewsSummary?.averageRating}
          totalReviews={reviewsSummary?.totalReviews ?? 0}
          isFavorite={!!isFavorite}
          onToggleFavorite={handleToggleFavorite}
          onViewReviews={handleViewReviews}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      </div>

      {/* ── TABS THÔNG TIN CHI TIẾT & BẢNG THÔNG SỐ & ĐÁNH GIÁ THỰC TẾ ── */}
      <ProductTabs
        product={product}
        reviewsSummary={reviewsSummary}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

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
