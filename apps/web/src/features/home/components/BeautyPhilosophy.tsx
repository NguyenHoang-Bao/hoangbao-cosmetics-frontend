import React from "react";
import videoNhanSac from "@/assets/video/video_nhansac.mp4";

export const BeautyPhilosophy: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hàng 1: Text Trái - Ảnh Phải */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-20">
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <div className="max-w-xl">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-4 block">
                01 / NÓI KHÔNG VỚI HÀNG GIẢ & KEM TRỘN
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 leading-tight mb-6">
                Chăm Sóc Làn Da Thật, <br />
                Không Bán Lời Hứa Suông
              </h2>
              <p className="text-neutral-700 text-base sm:text-lg leading-relaxed mb-8">
                Tụi mình hiểu nỗi sợ lớn nhất khi mua mỹ phẩm online là mua nhầm hàng nhái làm hỏng mặt. Ở Hoàng Bảo, từng chai serum hay thỏi son đều có tem phụ, nguồn gốc minh bạch và cam kết đền tiền gấp đôi nếu phát hiện hàng không chuẩn.
              </p>
              <div className="border-l-4 border-rose-400 bg-rose-50/60 pl-6 py-3.5 pr-4 rounded-r-2xl italic text-neutral-800 text-sm sm:text-base font-medium">
                "Không có phép màu đẹp cấp tốc sau 1 đêm. Tụi mình chỉ có những sản phẩm chuẩn chỉ giúp da bạn khỏe lên từng ngày một cách an tâm nhất."
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=900&auto=format&fit=crop"
                alt="Thành phần thiên nhiên"
                className="w-full h-auto object-cover rounded-3xl shadow-lg border border-neutral-100"
                loading="lazy"
              />
              <span className="absolute -bottom-3 -left-3 bg-rose-500 text-white px-5 py-2 text-xs font-bold tracking-widest uppercase rounded-full shadow-md">
                ORGANIC INGREDIENTS
              </span>
            </div>
          </div>
        </div>

        {/* Hàng 2: Video Trái - Text Phải (So Le) */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <video
                autoPlay
                loop
                muted
                playsInline
                src={videoNhanSac}
                className="w-full h-auto object-cover rounded-3xl shadow-lg border border-neutral-100"
              >
                <source src={videoNhanSac} type="video/mp4" />
              </video>
              <span className="absolute -bottom-3 -right-3 bg-rose-500 text-white px-5 py-2 text-xs font-bold tracking-widest uppercase rounded-full shadow-md">
                CLINICAL SKINCARE
              </span>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="max-w-xl lg:pl-10">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-4 block">
                02 / THẤU HIỂU LÀN DA NGƯỜI VIỆT
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 leading-tight mb-6">
                Routine Êm Dịu Cho <br />
                Khí Hậu Nóng Ẩm Khói Bụi
              </h2>
              <p className="text-neutral-700 text-base sm:text-lg leading-relaxed mb-8">
                Thời tiết Việt Nam rất dễ khiến da đổ dầu, bít tắc chân lông và lên mụn. Tụi mình chọn lọc những dòng kem dưỡng, sữa rửa mặt có kết cấu mỏng nhẹ, thấm nhanh, không bết rít để da luôn thông thoáng suốt ngày dài.
              </p>
              <div className="border-l-4 border-rose-400 bg-rose-50/60 pl-6 py-3.5 pr-4 rounded-r-2xl italic text-neutral-800 text-sm sm:text-base font-medium">
                "Mỗi làn da là một câu chuyện riêng. Đừng ngại nhắn cho tụi mình nếu bạn chưa biết bắt đầu từ đâu, tụi mình luôn sẵn sàng lắng nghe."
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeautyPhilosophy;
