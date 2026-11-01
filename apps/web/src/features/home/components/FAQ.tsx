import React from "react";
import { ChevronDown } from "lucide-react";

export const FAQ: React.FC = () => {
  return (
    <section className="py-16 bg-white border-t border-neutral-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-rose-500 font-bold uppercase text-xs tracking-widest">
            Hỗ Trợ Nhanh Chóng
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-neutral-900 mt-2">
            Câu Hỏi Thường Gặp
          </h2>
          <div className="w-16 h-1 bg-rose-500 mx-auto mt-4 rounded-full" />
        </div>

        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          <details className="group bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-2xs [&_summary::-webkit-details-marker]:hidden hover:border-rose-300 transition-colors">
            <summary className="flex cursor-pointer items-center justify-between text-sm sm:text-base font-bold text-neutral-900">
              <span>Làm sao để tôi biết da mình thuộc loại nào?</span>
              <span className="transition-transform duration-300 group-open:-rotate-180 text-rose-500 shrink-0 ml-2">
                <ChevronDown className="w-5 h-5" />
              </span>
            </summary>
            <div className="mt-4 text-neutral-600 leading-relaxed text-xs sm:text-sm border-t border-neutral-100 pt-4">
              Bạn có thể tự kiểm tra bằng cách rửa mặt sạch, không bôi bất kỳ sản phẩm nào và đợi 30 phút. Nếu da đổ bóng toàn mặt là da dầu, căng rát là da khô, đổ dầu vùng chữ T là da hỗn hợp. Hoặc tham gia ngay bài trắc nghiệm chẩn đoán da K-Beauty 60 giây trên website để nhận phác đồ routine hoàn toàn miễn phí!
            </div>
          </details>

          <details className="group bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-2xs [&_summary::-webkit-details-marker]:hidden hover:border-rose-300 transition-colors">
            <summary className="flex cursor-pointer items-center justify-between text-sm sm:text-base font-bold text-neutral-900">
              <span>Sản phẩm của shop có dùng được cho phụ nữ mang thai không?</span>
              <span className="transition-transform duration-300 group-open:-rotate-180 text-rose-500 shrink-0 ml-2">
                <ChevronDown className="w-5 h-5" />
              </span>
            </summary>
            <div className="mt-4 text-neutral-600 leading-relaxed text-xs sm:text-sm border-t border-neutral-100 pt-4">
              Đa số các dòng sản phẩm dưỡng ẩm, làm sạch thiên nhiên đều an toàn. Tuy nhiên, các dòng treatment chứa Retinol, BHA nồng độ cao thì mẹ bầu KHÔNG nên dùng. Vui lòng nhắn tin cho shop hoặc kiểm tra bảng thành phần để được lọc sản phẩm phù hợp và an toàn nhất.
            </div>
          </details>

          <details className="group bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200/80 shadow-2xs [&_summary::-webkit-details-marker]:hidden hover:border-rose-300 transition-colors">
            <summary className="flex cursor-pointer items-center justify-between text-sm sm:text-base font-bold text-neutral-900">
              <span>Thời gian đổi trả hàng khi có lỗi là bao lâu?</span>
              <span className="transition-transform duration-300 group-open:-rotate-180 text-rose-500 shrink-0 ml-2">
                <ChevronDown className="w-5 h-5" />
              </span>
            </summary>
            <div className="mt-4 text-neutral-600 leading-relaxed text-xs sm:text-sm border-t border-neutral-100 pt-4">
              Chúng tôi hỗ trợ 1 đổi 1 miễn phí hoặc hoàn tiền 100% trong vòng 7 ngày nếu sản phẩm bị lỗi móp méo do vận chuyển, chảy kem, vòi pump hỏng hoặc giao sai phân loại. Yêu cầu có video quay lại quá trình mở hộp nguyên vẹn (Unbox).
            </div>
          </details>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
