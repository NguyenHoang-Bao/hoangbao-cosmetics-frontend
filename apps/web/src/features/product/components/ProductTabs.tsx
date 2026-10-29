import React, { useState } from "react";
import { CheckCircle2, Sparkles, Shield, RefreshCw, Truck } from "lucide-react";
import type { Product } from "@hoangbao/types";

interface ProductTabsProps {
  product: Product;
}

export const ProductTabs: React.FC<ProductTabsProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<
    "benefits" | "ingredients" | "usage" | "policy"
  >("benefits");

  const tabClass = (tab: typeof activeTab) =>
    `px-4 sm:px-6 py-3 font-bold uppercase tracking-wider text-xs sm:text-sm transition-all border-b-2 cursor-pointer ${
      activeTab === tab
        ? "border-rose-500 text-rose-600 bg-rose-50/50 rounded-t-lg"
        : "border-transparent text-neutral-500 hover:text-neutral-900"
    }`;

  const benefitsList = product.benefits
    ? product.benefits
        .split("\n")
        .map((b) => b.replace(/^[•\-*]\s*/, "").trim())
        .filter(Boolean)
    : [];

  const ingredientsList = product.keyIngredients
    ? product.keyIngredients
        .split(/[,\n]/)
        .map((i) => i.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="mt-14 pt-8 border-t border-neutral-200">
      {/* ── THANH CHỌN TAB ── */}
      <div className="flex flex-wrap justify-center border-b border-neutral-200 mb-8 gap-1 sm:gap-4">
        <button
          type="button"
          onClick={() => setActiveTab("benefits")}
          className={tabClass("benefits")}
        >
          Công dụng nổi bật
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("ingredients")}
          className={tabClass("ingredients")}
        >
          Thành phần chính
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("usage")}
          className={tabClass("usage")}
        >
          Hướng dẫn sử dụng
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("policy")}
          className={tabClass("policy")}
        >
          Chính sách & Bảo hành
        </button>
      </div>

      {/* ── NỘI DUNG TỪNG TAB ── */}
      <div className="max-w-4xl mx-auto text-neutral-700 leading-relaxed">
        {/* TAB 1: CÔNG DỤNG & MÔ TẢ */}
        {activeTab === "benefits" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-rose-500" />
                <span>Mô tả chi tiết sản phẩm</span>
              </h3>
              <div className="text-sm sm:text-base text-neutral-600 leading-relaxed whitespace-pre-line bg-neutral-50/70 p-5 rounded-2xl border border-neutral-200">
                {product.description ||
                  "Thông tin chi tiết về sản phẩm đang được đội ngũ dược mỹ phẩm Hoàng Bảo Cosmetics cập nhật."}
              </div>
            </div>

            {benefitsList.length > 0 && (
              <div>
                <h3 className="text-base sm:text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-rose-500" />
                  <span>Hiệu quả & Lợi ích đối với làn da</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {benefitsList.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-4 rounded-xl border border-rose-100 bg-rose-50/30"
                    >
                      <CheckCircle2 className="w-4 h-4 text-rose-500 mt-1 shrink-0" />
                      <span className="text-xs sm:text-sm text-neutral-800 font-medium leading-relaxed">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: THÀNH PHẦN */}
        {activeTab === "ingredients" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-500" />
                <span>Thành phần hoạt chất nổi bật</span>
              </h3>
              {ingredientsList.length > 0 ? (
                <div className="flex flex-wrap gap-2.5">
                  {ingredientsList.map((ingredient, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm rounded-xl font-medium shadow-2xs"
                    >
                      ✦ {ingredient}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-500 italic bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                  Thành phần chi tiết theo công bố của nhà sản xuất đang được cập nhật. Cam kết không chứa paraben, cồn khô gây hại cho da.
                </p>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: HƯỚNG DẪN SỬ DỤNG */}
        {activeTab === "usage" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-rose-500" />
                <span>Cách dùng chuẩn chuyên gia da liễu</span>
              </h3>
              <div className="bg-rose-50/40 p-5 rounded-2xl border border-rose-200 text-sm sm:text-base text-neutral-800 leading-relaxed whitespace-pre-line">
                {product.usageInstruction ||
                  "1. Làm sạch da mặt với nước tẩy trang và sữa rửa mặt phù hợp.\n2. Lấy một lượng sản phẩm vừa đủ ra đầu ngón tay hoặc bông tẩy trang.\n3. Thoa đều nhẹ nhàng lên toàn bộ vùng da mặt và cổ theo chiều xoắn ốc từ dưới lên trên.\n4. Vỗ nhẹ trong 1-2 phút để các dưỡng chất thẩm thấu sâu vào da. Sử dụng đều đặn sáng và tối."}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CHÍNH SÁCH BẢO HÀNH */}
        {activeTab === "policy" && (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex items-start gap-3">
              <Shield className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-neutral-900 mb-1">Cam kết 100% Chính Hãng</h4>
                <p className="text-neutral-600">
                  Hoàng Bảo Cosmetics phân phối trực tiếp từ các thương hiệu chính hãng có tem phụ tiếng Việt và hóa đơn chứng từ đầy đủ. Bồi thường 200% nếu phát hiện hàng giả.
                </p>
              </div>
            </div>

            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex items-start gap-3">
              <RefreshCw className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-neutral-900 mb-1">Chính Sách Đổi Trả Trong 7 Ngày</h4>
                <p className="text-neutral-600">
                  Hỗ trợ đổi trả miễn phí trong vòng 7 ngày đối với các sản phẩm bị lỗi do nhà sản xuất, hư hỏng trong quá trình vận chuyển hoặc giao sai mẫu.
                </p>
              </div>
            </div>

            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex items-start gap-3">
              <Truck className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-neutral-900 mb-1">Giao Hàng Nhanh Toàn Quốc</h4>
                <p className="text-neutral-600">
                  Giao nhanh 2h tại TP.HCM. Giao hàng toàn quốc từ 1-3 ngày làm việc. Cho phép kiểm tra hàng trước khi thanh toán (COD).
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
