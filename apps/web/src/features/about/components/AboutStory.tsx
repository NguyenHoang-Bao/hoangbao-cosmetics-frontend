import videoNhanSac from "@/assets/video/video_nhansac.mp4";

export default function AboutStory() {
  return (
    <section className="py-20 md:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header phân đoạn Editorial */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
          <span className="text-xs font-semibold tracking-[3px] text-rose-600 uppercase block mb-3">
            Hành Trình Tỏa Sáng
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-neutral-900 tracking-tight leading-tight">
            Câu Chuyện Của <br className="hidden sm:inline" />
            <span className="font-semibold text-neutral-900">Hoàng Bảo Cosmetics</span>
          </h2>
          <div className="w-12 h-px bg-neutral-900 mx-auto mt-6" />
        </div>

        {/* Khối 1: Ảnh Trái - Text Phải (Khởi nguồn thương hiệu) */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-24 lg:mb-36">
          <div className="lg:w-1/2 w-full">
            <div className="relative overflow-hidden rounded-2xl shadow-sm border border-neutral-100 bg-neutral-50 aspect-[4/3] sm:aspect-[16/11]">
              <img
                src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=1000&q=80&auto=format&fit=crop"
                alt="Không gian Hoàng Bảo Cosmetics và sản phẩm chăm sóc da"
                className="w-full h-full object-cover transform hover:scale-103 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute bottom-5 left-5 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-neutral-200/60 shadow-xs">
                <span className="text-[11px] font-semibold text-neutral-800 tracking-wider uppercase">
                  100% An Toàn &bull; Nguồn Hữu Cơ Quốc Tế
                </span>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 w-full lg:pl-6">
            <span className="text-xs tracking-[2.5px] uppercase font-semibold text-neutral-400 block mb-3">
              Khởi Nguồn Từ Sự Thấu Hiểu
            </span>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-light text-neutral-900 mb-6 leading-snug">
              Kiến Tạo Chuẩn Mực Mới Cho Làn Da Khỏe Đẹp
            </h3>

            <p className="text-neutral-600 leading-relaxed mb-5 text-base sm:text-lg">
              Giữa thị trường mỹ phẩm phong phú nhưng cũng đầy rẫy nỗi lo về hàng giả, kem trộn trôi nổi và các sản phẩm bào mòn da, <strong className="text-neutral-900 font-semibold">Hoàng Bảo Cosmetics</strong> được sáng lập với khát khao trở thành bến đỗ an tâm tuyệt đối cho phái đẹp Việt.
            </p>

            <p className="text-neutral-600 leading-relaxed mb-8 text-base sm:text-lg">
              Chúng tôi tin rằng, một làn da đẹp rạng rỡ không đến từ những phép màu cấp tốc gây tổn thương, mà bắt nguồn từ sự kiên trì chăm sóc bằng những thành phần tinh khiết, minh bạch nguồn gốc và tương thích sinh học với cấu trúc da.
            </p>

            <div className="border-l-2 border-rose-500 pl-6 py-2 my-4">
              <p className="italic text-neutral-800 text-base sm:text-lg leading-relaxed font-art">
                &ldquo;Chúng tôi không chỉ phân phối mỹ phẩm &mdash; Chúng tôi cùng bạn lắng nghe làn da, chữa lành những tổn thương và tìm lại sự tự tin nguyên bản nhất.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Khối 2: Text Trái - Video Phải (Triết lý khoa học & cá nhân hóa) */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
          <div className="lg:w-1/2 w-full lg:pr-6">
            <span className="text-xs tracking-[2.5px] uppercase font-semibold text-neutral-400 block mb-3">
              Triết Lý Làm Đẹp Khoa Học
            </span>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-light text-neutral-900 mb-6 leading-snug">
              Sự Kết Hợp Hoàn Hảo Giữa Thiên Nhiên &amp; Hoạt Chất Chuyên Sâu
            </h3>

            <p className="text-neutral-600 leading-relaxed mb-8 text-base sm:text-lg">
              Định hướng của Hoàng Bảo Cosmetics là dòng sản phẩm <strong className="text-neutral-900 font-semibold">Dược Mỹ Phẩm (Cosmeceuticals)</strong>. Từng công thức đều được nghiên cứu nghiêm ngặt, kết hợp giữa chiết xuất thực vật lành tính (rau má hữu cơ, tràm trà, cúc la mã) và các hoạt chất vàng da liễu (Niacinamide, AHA/BHA, Hyaluronic Acid đa tầng, Retinol bọc, Peptides).
            </p>

            {/* 3 Tiêu chí kiểm định - Layout danh mục số thanh mảnh chuẩn Editorial */}
            <div className="space-y-4 pt-4 border-t border-neutral-100">
              <div className="flex items-start gap-4">
                <span className="text-xs font-mono font-semibold text-rose-600 mt-1">01</span>
                <p className="text-neutral-700 text-sm sm:text-base leading-relaxed">
                  100% sản phẩm có tem chống giả, tem phụ hướng dẫn và mã vạch truy xuất nguồn gốc rõ ràng.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-xs font-mono font-semibold text-rose-600 mt-1">02</span>
                <p className="text-neutral-700 text-sm sm:text-base leading-relaxed">
                  Đội ngũ chuyên viên đào tạo bài bản, hỗ trợ soi da và phác đồ routine riêng cho từng nền da.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-xs font-mono font-semibold text-rose-600 mt-1">03</span>
                <p className="text-neutral-700 text-sm sm:text-base leading-relaxed">
                  Đóng gói tiêu chuẩn dược phẩm với 3 lớp bọc chống sốc khí bảo vệ an toàn khi vận chuyển toàn quốc.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="relative overflow-hidden rounded-2xl shadow-sm border border-neutral-100 bg-neutral-950 aspect-[4/3] sm:aspect-[16/11]">
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
              <div className="absolute top-5 right-5 bg-neutral-900/80 backdrop-blur-sm text-white text-[10px] font-semibold px-3 py-1.5 rounded-full uppercase tracking-[2px] border border-white/10">
                Clinical Skincare
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { AboutStory };
