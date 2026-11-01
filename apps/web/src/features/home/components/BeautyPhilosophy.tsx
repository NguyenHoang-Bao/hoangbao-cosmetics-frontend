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
                01 / NGUỒN GỐC NGUYÊN BẢN
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 leading-tight mb-6">
                Từ Thành Phần Thiên Nhiên <br />
                Đến Vẻ Đẹp Thuần Khiết
              </h2>
              <p className="text-neutral-700 text-base sm:text-lg leading-relaxed mb-8">
                Một làn da khỏe mạnh luôn bắt đầu từ sự lành tính. Những thành phần hữu cơ được tuyển chọn kỹ lưỡng, chiết xuất theo công nghệ hiện đại để giữ lại trọn vẹn dưỡng chất tinh túy nhất từ thiên nhiên.
              </p>
              <div className="border-l-4 border-rose-400 bg-rose-50/60 pl-6 py-3.5 pr-4 rounded-r-2xl italic text-neutral-800 text-sm sm:text-base font-medium">
                "Không paraben, không hương liệu nhân tạo. Nuôi dưỡng làn da rạng rỡ sâu từ bên trong với cam kết 100% an toàn và dịu nhẹ."
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
                02 / HIỆU QUẢ CHUẨN Y KHOA
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 leading-tight mb-6">
                Công Nghệ Đột Phá — <br />
                Phục Hồi Từng Tế Bào
              </h2>
              <p className="text-neutral-700 text-base sm:text-lg leading-relaxed mb-8">
                Sự kết hợp hoàn hảo giữa thiên nhiên và khoa học liễu da. Các công thức độc quyền được kiểm nghiệm lâm sàng giúp phục hồi hàng rào bảo vệ, cấp ẩm sâu và chống lại các dấu hiệu lão hóa hiệu quả.
              </p>
              <div className="border-l-4 border-rose-400 bg-rose-50/60 pl-6 py-3.5 pr-4 rounded-r-2xl italic text-neutral-800 text-sm sm:text-base font-medium">
                "Lắng nghe làn da để mang lại giải pháp chăm sóc cá nhân hóa, giúp bạn tự tin tỏa sáng với vẻ đẹp độc bản của chính mình."
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeautyPhilosophy;
