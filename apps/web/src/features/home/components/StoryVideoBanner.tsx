import React from "react";
import { Link } from "react-router-dom";
import videoBanner from "@/assets/video/videobanner.mp4";

export const StoryVideoBanner: React.FC = () => {
  return (
    <section className="relative w-full py-20 md:py-28 overflow-hidden my-12 flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          src={videoBanner}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoBanner} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white max-w-4xl">
        {/* Nhãn nhỏ trên cùng */}
        <span className="text-xs sm:text-sm font-bold uppercase tracking-[4px] text-rose-300 mb-3 block">
          CHUYỆN LÀM ĐẸP HOÀNG BẢO
        </span>

        {/* Tiêu đề lớn */}
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight md:leading-snug mb-4 tracking-tight">
          Bí Quyết Thanh Xuân
          <br className="hidden sm:inline" /> Hành Trình Nuôi Dưỡng Làn Da Rạng Rỡ
        </h2>

        {/* Đoạn mô tả phụ */}
        <p className="text-sm sm:text-base md:text-lg text-neutral-200 max-w-2xl mx-auto mb-8 leading-relaxed font-light">
          Gìn giữ vẻ đẹp thuần khiết nguyên bản từ những thành phần tự nhiên lành tính, an toàn tuyệt đối cho mọi làn da.
        </p>

        {/* 3 Hộp nội dung */}
        <div className="flex flex-col gap-3.5 max-w-3xl mx-auto mb-8 text-left">
          <div className="bg-black/50 backdrop-blur-md border border-white/15 rounded-2xl px-6 py-4 flex items-center gap-4 hover:bg-black/60 transition-all">
            <p className="text-xs sm:text-base text-white/95 font-medium leading-relaxed">
              Tuyển chọn tiêu chuẩn thành phần hữu cơ sạch, lành tính và an toàn tuyệt đối cho cả mẹ bầu và làn da nhạy cảm nhất.
            </p>
          </div>

          <div className="bg-black/50 backdrop-blur-md border border-white/15 rounded-2xl px-6 py-4 flex items-center gap-4 hover:bg-black/60 transition-all">
            <p className="text-xs sm:text-base text-white/95 font-medium leading-relaxed">
              Kỹ thuật chiết xuất & ủ dưỡng chất khép kín chuẩn GMP, lưu giữ trọn vẹn tinh chất và hiệu quả dược tính tự nhiên.
            </p>
          </div>

          <div className="bg-black/50 backdrop-blur-md border border-white/15 rounded-2xl px-6 py-4 flex items-center gap-4 hover:bg-black/60 transition-all">
            <p className="text-xs sm:text-base text-white/95 font-medium leading-relaxed">
              Đóng gói cẩn trọng, thân thiện với môi trường, trao gửi tận tay khách hàng như một món quà ý nghĩa.
            </p>
          </div>
        </div>

        {/* Nút Khám Phá */}
        <div>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-full shadow-lg shadow-rose-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Tìm Hiểu Câu Chuyện Thương Hiệu</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default StoryVideoBanner;
