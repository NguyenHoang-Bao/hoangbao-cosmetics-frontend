import React, { useState } from "react";
import { Star } from "lucide-react";
import type { Product, ProductReviewSummary } from "@hoangbao/types";
import { parseProductArrayData } from "@/lib/utils";

interface ProductTabsProps {
  product: Product;
  reviewsSummary?: ProductReviewSummary;
  activeTab?: "benefits" | "ingredients" | "usage" | "reviews";
  onTabChange?: (tab: "benefits" | "ingredients" | "usage" | "reviews") => void;
}

export const ProductTabs: React.FC<ProductTabsProps> = ({
  product,
  reviewsSummary,
  activeTab: controlledTab,
  onTabChange,
}) => {
  const [internalTab, setInternalTab] = useState<
    "benefits" | "ingredients" | "usage" | "reviews"
  >("benefits");

  const currentTab = controlledTab ?? internalTab;
  const handleSelectTab = (tab: "benefits" | "ingredients" | "usage" | "reviews") => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalTab(tab);
    }
  };

  const totalReviews = reviewsSummary?.totalReviews ?? 0;
  const averageRating = reviewsSummary?.averageRating;
  const reviewsList = reviewsSummary?.reviews?.content ?? [];

  const tabClass = (tab: typeof currentTab) =>
    `px-4 sm:px-6 py-3 font-semibold text-xs sm:text-sm tracking-wide transition-all border-b-2 cursor-pointer ${
      currentTab === tab
        ? "border-neutral-900 text-neutral-900"
        : "border-transparent text-neutral-400 hover:text-neutral-700"
    }`;

  // Tách công dụng và thành phần an toàn (hỗ trợ JSON mảng từ DB)
  const benefitsList = parseProductArrayData(product.benefits);
  const ingredientsList = parseProductArrayData(product.keyIngredients);

  const brandName =
    typeof product.brand === "object" ? product.brand?.name : product.brand;
  const firstVariant = product.variants?.[0];

  // Kiểm tra xem dữ liệu HDSD trong DB có thực sự chia thành các bước không
  const rawUsage = product.usageInstruction?.trim() || "";
  const usageLines = rawUsage ? rawUsage.split(/\r?\n/).filter(Boolean) : [];
  const hasMultipleSteps =
    usageLines.length > 1 &&
    usageLines.some((line) => /^(bước\s*\d+|step\s*\d+|\d+\.)/i.test(line));

  return (
    <div id="product-tabs" className="mt-14 pt-8 border-t border-neutral-200">
      {/* ── THANH CHỌN TAB ── */}
      <div className="flex flex-wrap justify-center border-b border-neutral-200 mb-8 gap-2 sm:gap-6">
        <button
          type="button"
          onClick={() => handleSelectTab("benefits")}
          className={tabClass("benefits")}
        >
          Công dụng & Mô tả
        </button>
        <button
          type="button"
          onClick={() => handleSelectTab("ingredients")}
          className={tabClass("ingredients")}
        >
          Thành phần ({ingredientsList.length || 0})
        </button>
        <button
          type="button"
          onClick={() => handleSelectTab("usage")}
          className={tabClass("usage")}
        >
          Hướng dẫn sử dụng
        </button>
        <button
          type="button"
          onClick={() => handleSelectTab("reviews")}
          className={tabClass("reviews")}
        >
          Đánh giá ({totalReviews})
        </button>
      </div>

      {/* ── NỘI DUNG TỪNG TAB ── */}
      <div className="max-w-3xl mx-auto text-neutral-700 leading-relaxed">
        {/* TAB 1: CÔNG DỤNG & MÔ TẢ & BẢNG THÔNG SỐ */}
        {currentTab === "benefits" && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xs uppercase font-bold tracking-wider text-neutral-900 mb-3">
                Mô tả chi tiết sản phẩm
              </h3>
              <div className="text-sm sm:text-base text-neutral-600 leading-relaxed whitespace-pre-line">
                {product.description || (
                  <span className="text-neutral-400 italic">
                    Mô tả chi tiết đang được cập nhật từ nhà sản xuất.
                  </span>
                )}
              </div>
            </div>

            {/* BẢNG THÔNG SỐ KỸ THUẬT CHI TIẾT */}
            <div className="pt-2">
              <h3 className="text-xs uppercase font-bold tracking-wider text-neutral-900 mb-3">
                Thông số sản phẩm
              </h3>
              <div className="border border-neutral-200/80 rounded-2xl overflow-hidden text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-neutral-200/80">
                  <div className="divide-y divide-neutral-100">
                    <div className="flex py-2.5 px-4 bg-neutral-50/50">
                      <span className="w-36 text-neutral-500 font-medium shrink-0">Thương hiệu</span>
                      <span className="font-semibold text-neutral-800">{brandName || "Chính hãng"}</span>
                    </div>
                    <div className="flex py-2.5 px-4">
                      <span className="w-36 text-neutral-500 font-medium shrink-0">Danh mục</span>
                      <span className="text-neutral-800">{product.category?.name || "Mỹ phẩm"}</span>
                    </div>
                    <div className="flex py-2.5 px-4 bg-neutral-50/50">
                      <span className="w-36 text-neutral-500 font-medium shrink-0">Dung tích / Quy cách</span>
                      <span className="text-neutral-800">{firstVariant?.capacity || firstVariant?.volume || "Tiêu chuẩn"}</span>
                    </div>
                    <div className="flex py-2.5 px-4">
                      <span className="w-36 text-neutral-500 font-medium shrink-0">Mã SKU</span>
                      <span className="font-mono text-neutral-800">{firstVariant?.sku || `HB-${product.idProduct}`}</span>
                    </div>
                  </div>
                  <div className="divide-y divide-neutral-100">
                    <div className="flex py-2.5 px-4 bg-neutral-50/50">
                      <span className="w-36 text-neutral-500 font-medium shrink-0">Loại da phù hợp</span>
                      <span className="text-neutral-800">Mọi loại da, an toàn cho da nhạy cảm</span>
                    </div>
                    <div className="flex py-2.5 px-4">
                      <span className="w-36 text-neutral-500 font-medium shrink-0">Kết cấu</span>
                      <span className="text-neutral-800">Dễ thẩm thấu, không nhờn rít</span>
                    </div>
                    <div className="flex py-2.5 px-4 bg-neutral-50/50">
                      <span className="w-36 text-neutral-500 font-medium shrink-0">Hạn sử dụng</span>
                      <span className="text-neutral-800">36 tháng kể từ ngày sản xuất</span>
                    </div>
                    <div className="flex py-2.5 px-4">
                      <span className="w-36 text-neutral-500 font-medium shrink-0">Bảo quản</span>
                      <span className="text-neutral-800">Nơi khô ráo, tránh ánh nắng trực tiếp</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {benefitsList.length > 0 && (
              <div className="pt-2">
                <h3 className="text-xs uppercase font-bold tracking-wider text-neutral-900 mb-3">
                  Hiệu quả & Lợi ích nổi bật
                </h3>
                <ul className="space-y-2.5">
                  {benefitsList.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-neutral-600">
                      <span className="text-rose-500 font-bold select-none leading-relaxed">—</span>
                      <span className="leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: THÀNH PHẦN HOẠT CHẤT & TIÊU CHUẨN AN TOÀN */}
        {currentTab === "ingredients" && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <h3 className="text-xs uppercase font-bold tracking-wider text-neutral-900">
                  Thành phần hoạt chất nổi bật
                </h3>
                {ingredientsList.length > 0 && (
                  <span className="text-[11px] font-medium text-neutral-500 bg-neutral-100 px-2.5 py-0.5 rounded-full">
                    {ingredientsList.length} hoạt chất chính
                  </span>
                )}
              </div>

              {/* BẢNG TỪ ĐIỂN HOẠT CHẤT LIỀN KHỐI (UNIFIED MATRIX) - KHÔNG BỊ LẺ TẺ */}
              {ingredientsList.length > 0 ? (
                <div className="border border-neutral-200/80 rounded-2xl overflow-hidden divide-y divide-neutral-100 bg-white shadow-2xs mb-6">
                  {ingredientsList.map((ingredient, idx) => {
                    const parts = ingredient.split(/\s*[-:]\s*/);
                    const name = parts[0]?.trim();
                    const desc = parts.slice(1).join(" - ").trim();
                    return (
                      <div
                        key={idx}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-4 hover:bg-neutral-50/50 transition-colors"
                      >
                        <div className="space-y-1 min-w-0">
                          <h4 className="text-sm font-bold text-neutral-900 tracking-tight">
                            {name}
                          </h4>
                          {desc && (
                            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                              {desc}
                            </p>
                          )}
                        </div>
                        <span className="self-start sm:self-auto shrink-0 text-[11px] font-medium text-neutral-400">
                          Hoạt chất chính
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-5 rounded-2xl border border-neutral-100 bg-neutral-50/70 text-sm text-neutral-500 italic mb-6">
                  Thành phần chi tiết theo công bố của nhà sản xuất đang được cập nhật.
                </div>
              )}

              {/* CAM KẾT CÔNG THỨC AN TOÀN */}
              <div className="p-4 sm:p-5 rounded-2xl border border-neutral-100 bg-neutral-50/50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2.5">
                  Tiêu chuẩn an toàn da liễu
                </h4>
                <div className="flex flex-wrap gap-2 text-xs text-neutral-600">
                  <span className="px-3 py-1 bg-white border border-neutral-200/70 rounded-full font-medium">
                    0% Cồn khô (Alcohol-free)
                  </span>
                  <span className="px-3 py-1 bg-white border border-neutral-200/70 rounded-full font-medium">
                    0% Paraben & Dầu khoáng
                  </span>
                  <span className="px-3 py-1 bg-white border border-neutral-200/70 rounded-full font-medium">
                    Độ pH cân bằng sinh học
                  </span>
                  <span className="px-3 py-1 bg-white border border-neutral-200/70 rounded-full font-medium">
                    Kiểm nghiệm an toàn cho da
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HƯỚNG DẪN SỬ DỤNG - ROUTINE TIMELINE TỐI GIẢN */}
        {currentTab === "usage" && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs uppercase font-bold tracking-wider text-neutral-900">
                  Quy trình sử dụng gợi ý
                </h3>
                <span className="text-[11px] font-medium text-neutral-500 bg-neutral-100 px-2.5 py-0.5 rounded-full">
                  Khuyên dùng: Sáng & Tối
                </span>
              </div>

              {/* DÒNG THỜI GIAN QUY TRÌNH (TIMELINE TỐI GIẢN) */}
              {hasMultipleSteps ? (
                <div className="relative pl-7 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-px before:bg-neutral-200 mb-8">
                  {usageLines.map((step, idx) => {
                    const match = step.match(/^(Bước\s*\d+|Step\s*\d+|\d+\.)\s*:?\s*(.*)$/i);
                    const stepLabel = match ? match[1] : `Bước ${idx + 1}`;
                    const stepContent = match ? match[2] : step;
                    return (
                      <div key={idx} className="relative group">
                        <span className="absolute -left-7 sm:-left-8 top-0.5 flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border border-neutral-300 text-neutral-900 text-xs font-semibold shadow-2xs group-hover:border-neutral-900 group-hover:bg-neutral-900 group-hover:text-white transition-all">
                          {idx + 1}
                        </span>
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                            {stepLabel}
                          </h4>
                          <p className="text-sm text-neutral-600 leading-relaxed">
                            {stepContent}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Khi dữ liệu là 1 đoạn văn: Vẫn giữ phong cách timeline tinh tế, không thô cứng */
                <div className="relative pl-7 sm:pl-8 before:absolute before:left-3 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-px before:bg-neutral-200 mb-8">
                  <div className="relative">
                    <span className="absolute -left-7 sm:-left-8 top-0.5 flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border border-neutral-300 text-neutral-900 text-xs font-semibold shadow-2xs">
                      •
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                        Quy trình áp dụng
                      </h4>
                      <p className="text-sm text-neutral-600 leading-relaxed">
                        {rawUsage || (
                          <span className="text-neutral-400 italic">
                            Hướng dẫn sử dụng đang được cập nhật từ nhà sản xuất.
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* LƯU Ý KHI SỬ DỤNG - MINIMALIST */}
              <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50/70 border border-neutral-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2.5">
                  Lưu ý khi sử dụng & bảo quản
                </h4>
                <ul className="space-y-2 text-xs text-neutral-600">
                  <li className="flex items-start gap-2.5">
                    <span className="text-neutral-400 font-bold select-none leading-relaxed">—</span>
                    <span className="leading-relaxed">
                      Đậy kín nắp ngay sau khi sử dụng để tránh oxy hóa và bảo toàn hoạt chất.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-neutral-400 font-bold select-none leading-relaxed">—</span>
                    <span className="leading-relaxed">
                      Tránh tiếp xúc trực tiếp với mắt. Ngưng sử dụng nếu có dấu hiệu mẩn đỏ hoặc kích ứng.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-neutral-400 font-bold select-none leading-relaxed">—</span>
                    <span className="leading-relaxed">
                      Bảo quản nơi khô ráo, thoáng mát (dưới 30°C), tránh ánh nắng chiếu trực tiếp.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ĐÁNH GIÁ THỰC TẾ TỪ KHÁCH HÀNG */}
        {currentTab === "reviews" && (
          <div className="space-y-6">
            {totalReviews > 0 ? (
              <div>
                {/* Tổng quan rating */}
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-neutral-50 border border-neutral-100 mb-6">
                  <div className="text-center sm:text-left">
                    <div className="text-3xl font-extrabold text-neutral-900">
                      {averageRating ? averageRating.toFixed(1) : "5.0"}
                      <span className="text-base font-normal text-neutral-400">/5</span>
                    </div>
                    <div className="flex text-amber-400 my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(averageRating || 5)
                              ? "fill-amber-400 text-amber-400"
                              : "text-neutral-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-neutral-500">
                      Dựa trên {totalReviews} nhận xét thực tế
                    </p>
                  </div>
                </div>

                {/* Danh sách các bài đánh giá */}
                <div className="space-y-4 divide-y divide-neutral-100">
                  {reviewsList.map((review) => {
                    const initials = (review.userFullName || "Khách hàng")
                      .charAt(0)
                      .toUpperCase();
                    const formattedDate = review.createdAt
                      ? new Date(review.createdAt).toLocaleDateString("vi-VN")
                      : "";

                    return (
                      <div key={review.idReview} className="pt-4 first:pt-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-700 font-bold text-xs flex items-center justify-center">
                              {initials}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-neutral-900">
                                {review.userFullName || "Khách hàng"}
                              </p>
                              {formattedDate && (
                                <p className="text-[11px] text-neutral-400">
                                  {formattedDate}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < Math.round(review.ratingPoint || 5)
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-neutral-200"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        {review.content && (
                          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed pl-10">
                            {review.content}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 px-4 rounded-2xl bg-neutral-50/60 border border-neutral-100">
                <Star className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-neutral-800 mb-1">
                  Chưa có đánh giá nào cho sản phẩm này
                </h4>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Hãy là người đầu tiên trải nghiệm và chia sẻ cảm nhận về sản phẩm này sau khi đặt hàng.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
