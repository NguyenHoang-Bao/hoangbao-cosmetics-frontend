import videoNhanSac from "@/assets/video/video_nhansac.mp4";
import { Sparkles, CheckCircle2, Leaf, Heart } from "lucide-react";

export default function AboutStory() {
  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề phân đoạn nhỏ */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <span className="text-xs sm:text-sm font-bold tracking-[3px] text-rose-500 uppercase block mb-3">
            HÀNH TRÌNH TỎA SÁNG
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Câu Chuyện Của <br className="hidden sm:inline" />
            <span className="text-rose-600">Hoàng Bảo Cosmetics</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-rose-500 to-pink-400 mx-auto mt-4 rounded-full" />
        </div>

        {/* Khối 1: Ảnh Trái - Text Phải (Khởi nguồn thương hiệu) */}
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 mb-20 lg:mb-28">
          <div className="lg:w-1/2 w-full">
            <div className="relative group">
              {/* Lớp nền đổ bóng mềm mại */}
              <div className="absolute -inset-2 bg-gradient-to-r from-rose-200 to-pink-200 rounded-3xl blur-lg opacity-60 group-hover:opacity-80 transition duration-500" />

              <div className="relative overflow-hidden rounded-2xl shadow-xl border border-rose-100 bg-white aspect-[4/3] sm:aspect-[16/11]">
                <img
                  src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=1000&q=80&auto=format&fit=crop"
                  alt="Không gian Hoàng Bảo Cosmetics và sản phẩm chăm sóc da"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-lg border border-pink-100 flex items-center gap-2.5">
                  <Leaf className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-gray-900 leading-tight">100% An Toàn & Lành Tính</p>
                    <p className="text-[11px] text-gray-500">Tuyển chọn từ nguồn hữu cơ chuẩn quốc tế</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 w-full lg:pl-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>01 / KHỞI NGUỒN TỪ SỰ THẤU HIỂU</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 leading-snug">
              Kiến Tạo Chuẩn Mực Mới Cho Làn Da Khỏe Đẹp
            </h3>

            <p className="text-gray-600 leading-relaxed mb-5 text-base sm:text-lg">
              Giữa thị trường mỹ phẩm phong phú nhưng cũng đầy rẫy nỗi lo về hàng giả, kem trộn trôi nổi và các sản phẩm bào mòn da, <strong className="text-gray-900 font-semibold">Hoàng Bảo Cosmetics</strong> được sáng lập với khát khao trở thành bến đỗ an tâm tuyệt đối cho phái đẹp Việt.
            </p>

            <p className="text-gray-600 leading-relaxed mb-6 text-base sm:text-lg">
              Chúng tôi tin rằng, một làn da đẹp rạng rỡ không đến từ những phép màu cấp tốc gây tổn thương, mà bắt nguồn từ sự kiên trì chăm sóc bằng những thành phần tinh khiết, minh bạch nguồn gốc và tương thích sinh học với cấu trúc da.
            </p>

            <div className="border-l-4 border-rose-500 bg-rose-50/60 p-4 rounded-r-xl">
              <p className="italic text-gray-800 text-sm sm:text-base font-medium font-art">
                &quot;Chúng tôi không chỉ phân phối mỹ phẩm &mdash; Chúng tôi cùng bạn lắng nghe làn da, chữa lành những tổn thương và tìm lại sự tự tin nguyên bản nhất.&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Khối 2: Text Trái - Video/Ảnh Phải (Triết lý khoa học & cá nhân hóa) */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-16">
          <div className="lg:w-1/2 w-full lg:pr-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold uppercase tracking-wider mb-4">
              <Heart className="w-3.5 h-3.5" />
              <span>02 / TRIẾT LÝ LÀM ĐẸP KHOA HỌC</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 leading-snug">
              Sự Kết Hợp Hoàn Hảo Giữa Thiên Nhiên & Hoạt Chất Chuyên Sâu
            </h3>

            <p className="text-gray-600 leading-relaxed mb-5 text-base sm:text-lg">
              Định hướng của Hoàng Bảo Cosmetics là dòng sản phẩm <strong className="text-gray-900 font-semibold">Dược Mỹ Phẩm (Cosmeceuticals)</strong>. Từng công thức đều được nghiên cứu nghiêm ngặt, kết hợp giữa chiết xuất thực vật lành tính (rau má hữu cơ, tràm trà, cúc la mã) và các hoạt chất vàng da liễu (Niacinamide, AHA/BHA, Hyaluronic Acid đa tầng, Retinol bọc, Peptides).
            </p>

            <div className="space-y-3.5 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm sm:text-base font-medium">
                  100% sản phẩm có tem chống giả, tem phụ hướng dẫn và mã vạch truy xuất nguồn gốc.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm sm:text-base font-medium">
                  Đội ngũ chuyên viên đào tạo bài bản, hỗ trợ soi da và phác đồ routine riêng cho từng cá nhân.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm sm:text-base font-medium">
                  Đóng gói tiêu chuẩn dược phẩm với 3 lớp bọc chống sốc khí bảo vệ an toàn chai lọ thủy tinh khi vận chuyển xa.
                </span>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-l from-rose-200 to-pink-200 rounded-3xl blur-lg opacity-60 group-hover:opacity-80 transition duration-500" />

              <div className="relative overflow-hidden rounded-2xl shadow-xl border border-rose-100 bg-white aspect-[4/3] sm:aspect-[16/11]">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  src={videoNhanSac}
                  className="w-full h-full object-cover"
                >
                  <source src={videoNhanSac} type="video/mp4" />
                </video>
                <div className="absolute top-4 right-4 bg-rose-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                  CLINICAL SKINCARE
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { AboutStory };
