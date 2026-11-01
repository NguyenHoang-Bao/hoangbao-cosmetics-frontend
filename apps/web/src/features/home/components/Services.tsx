import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const Services: React.FC = () => {
  return (
    <section className="py-20 bg-white border-t border-neutral-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-2">
              Dịch Vụ & Trải Nghiệm
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 m-0 tracking-tight">
              Trải Nghiệm Chu Đáo Tại Hoàng Bảo
            </h2>
          </div>
          <p className="text-neutral-600 text-xs sm:text-sm max-w-md lg:text-right leading-relaxed">
            Từ một thỏi son giao tận tay đến những bộ quà tặng chăm sóc da cao cấp, chúng tôi luôn chuẩn bị chu đáo để bạn an tâm làm đẹp.
          </p>
        </div>

        {/* 4 Cột chia làm 2 cụm có đường kẻ phía trên */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Cụm 1: 01 & 02 */}
          <div className="border-t-2 border-neutral-900 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest block mb-2">
                01 / TƯ VẤN ROUTINE
              </span>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                Soi Da & Lên Phác Đồ
              </h3>
              <p className="text-neutral-600 text-xs sm:text-[13px] leading-relaxed">
                Phân tích tình trạng da miễn phí qua hình ảnh, hướng dẫn xây dựng routine chuẩn y khoa cá nhân hóa theo từng tình trạng da.
              </p>
            </div>

            <div>
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest block mb-2">
                02 / CHÍNH HÃNG
              </span>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                Cam Kết Chuẩn Hãng
              </h3>
              <p className="text-neutral-600 text-xs sm:text-[13px] leading-relaxed">
                100% sản phẩm có hóa đơn chứng từ, tem phụ tiếng Việt rõ ràng. Cam kết đền bù gấp 10 lần nếu phát hiện hàng giả, hàng nhái.
              </p>
            </div>
          </div>

          {/* Cụm 2: 03 & 04 */}
          <div className="border-t-2 border-neutral-900 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest block mb-2">
                03 / PACKAGING
              </span>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                Đóng Gói & Chống Sốc
              </h3>
              <p className="text-neutral-600 text-xs sm:text-[13px] leading-relaxed">
                Màng bóng khí đa lớp niêm phong cẩn trọng, hộp carton 3 lớp cứng cáp giữ chai lọ thủy tinh luôn an toàn nguyên vẹn khi giao xa.
              </p>
            </div>

            <div>
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest block mb-2">
                04 / MEMBERSHIP
              </span>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                Tích Điểm Hội Viên
              </h3>
              <p className="text-neutral-600 text-xs sm:text-[13px] leading-relaxed">
                Tích điểm tự động bằng số điện thoại cho mỗi đơn đặt. Dễ dàng đổi điểm lấy voucher giảm giá và nhận quà tặng tháng sinh nhật.
              </p>
            </div>
          </div>
        </div>

        {/* Thanh chân trang dưới cùng */}
        <div className="mt-14 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-neutral-600">
            Cần tư vấn da hoặc đặt trước số lượng lớn? Hotline hỗ trợ:{" "}
            <strong className="font-bold text-neutral-900">0359 490 221</strong>
          </p>
          <Link
            to="/contact"
            className="text-xs sm:text-sm font-bold text-neutral-900 hover:text-rose-600 underline underline-offset-4 transition-colors inline-flex items-center gap-1.5"
          >
            <span>Liên hệ tư vấn</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;
