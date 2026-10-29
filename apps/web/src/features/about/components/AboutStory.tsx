import videoNhanSac from "@/assets/video/video_nhansac.mp4";

export default function AboutStory() {
  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Khối 1: Video Trái - Nội dung Phải (Triết lý thương hiệu) */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-24 md:mb-32">
          {/* Video Khung viền kiến trúc tối giản */}
          <div className="lg:w-1/2 w-full">
            <div className="relative overflow-hidden rounded-2xl bg-neutral-950 aspect-[4/3] sm:aspect-[16/11] shadow-xs border border-neutral-100">
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
              <div className="absolute top-4 right-4 bg-neutral-900/80 backdrop-blur-sm text-white text-[10px] font-medium px-3 py-1.5 rounded-full uppercase tracking-[2px]">
                Clean &amp; Clinical
              </div>
            </div>
          </div>

          {/* Nội dung câu chuyện súc tích, thực tế, không từ ngữ sáo rỗng */}
          <div className="lg:w-1/2 w-full">
            <span className="text-[11px] tracking-[3px] uppercase font-semibold text-neutral-400 block mb-4">
              Khởi Nguồn Thương Hiệu
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-neutral-900 mb-6 leading-snug tracking-tight">
              Khoa học làn da bắt đầu từ sự lành tính.
            </h2>

            <p className="text-neutral-600 leading-relaxed mb-5 text-base font-light">
              Hoàng Bảo Cosmetics ra đời từ mong muốn đơn giản: mang đến người dùng Việt những sản phẩm chăm sóc da có nguồn gốc minh bạch và công thức kiểm chứng khoa học.
            </p>

            <p className="text-neutral-600 leading-relaxed mb-6 text-base font-light">
              Chúng tôi tập trung vào dòng dược mỹ phẩm (cosmeceuticals) kết hợp hoạt chất nồng độ an toàn cùng chiết xuất thực vật tự nhiên &mdash; tôn trọng hàng rào sinh học tự nhiên của làn da thay vì theo đuổi những hiệu quả cấp tốc bào mòn.
            </p>

            <div className="border-l border-neutral-900 pl-6 py-1 my-6">
              <p className="italic text-neutral-800 text-sm sm:text-base leading-relaxed font-art">
                &ldquo;Đẹp bền vững là khi làn da được bảo vệ khỏe mạnh từ sâu bên trong mỗi ngày.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Khối 2: 3 Tiêu chuẩn vận hành cốt lõi - Layout tối giản phân chia bằng đường kẻ hairline */}
        <div className="border-t border-b border-neutral-200 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            <div>
              <span className="text-xs font-mono text-neutral-400 block mb-3">01</span>
              <h3 className="text-base font-medium text-neutral-900 mb-2 tracking-wide uppercase">
                Minh Bạch Nguồn Gốc
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed font-light">
                100% sản phẩm có tem chống giả, tem phụ hướng dẫn tiếng Việt và hóa đơn nhập khẩu rõ ràng từ các nhãn hàng ủy quyền.
              </p>
            </div>

            <div>
              <span className="text-xs font-mono text-neutral-400 block mb-3">02</span>
              <h3 className="text-base font-medium text-neutral-900 mb-2 tracking-wide uppercase">
                An Toàn &amp; Lành Tính
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed font-light">
                Tuyển chọn các công thức không cồn khô kích ứng, không paraben độc hại và tương thích sinh học với nền da nhạy cảm.
              </p>
            </div>

            <div>
              <span className="text-xs font-mono text-neutral-400 block mb-3">03</span>
              <h3 className="text-base font-medium text-neutral-900 mb-2 tracking-wide uppercase">
                Tư Vấn Cá Nhân Hóa
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed font-light">
                Đội ngũ tư vấn nắm vững kiến thức da liễu, hỗ trợ soi da và đồng hành xây dựng routine phù hợp với từng tình trạng da.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { AboutStory };
