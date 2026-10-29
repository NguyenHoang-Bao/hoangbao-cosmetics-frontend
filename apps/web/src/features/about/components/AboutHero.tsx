import Breadcrumb, { type BreadcrumbItem } from "@/components/ui/Breadcrumb";

const heroBgImg =
  "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=2070&q=80&auto=format&fit=crop";

export default function AboutHero() {
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Trang chủ", link: "/" },
    { label: "Về chúng tôi" },
  ];

  return (
    <section className="relative w-full min-h-[420px] md:min-h-[500px] flex items-center justify-center text-center overflow-hidden bg-neutral-950">
      {/* Background Image với lớp mờ tối giản chuẩn Studio */}
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat scale-102 transform transition-transform duration-1000"
        style={{ backgroundImage: `url(${heroBgImg})` }}
      />

      {/* Lớp phủ đen nhung điện ảnh, loại bỏ toàn bộ glow/blur màu mè */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/65 to-black/90 backdrop-blur-[1px]" />

      {/* Nội dung chính */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center">
        {/* Breadcrumb điều hướng tối giản */}
        <div className="mb-6">
          <Breadcrumb
            items={breadcrumbItems}
            className="justify-center text-neutral-400 text-xs tracking-wider uppercase font-medium [&_a]:text-neutral-400 [&_a:hover]:text-white [&_span]:text-neutral-200"
          />
        </div>

        {/* Eyebrow Label thanh mảnh không icon */}
        <span className="text-[11px] sm:text-xs tracking-[4px] uppercase text-rose-200/90 font-medium mb-4 block">
          Hoàng Bảo Cosmetics &bull; Clean &amp; Clinical Skincare
        </span>

        {/* Tiêu đề chính - Typography cao cấp */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-[3px] uppercase text-white mb-6 leading-tight">
          Về Chúng Tôi
        </h1>

        {/* Slogan thương hiệu */}
        <p className="text-sm sm:text-base md:text-lg text-neutral-300 max-w-2xl font-light leading-relaxed mb-10">
          Tôn vinh vẻ đẹp thuần khiết nguyên bản &mdash; Hành trình mang đến giải pháp chăm sóc da khoa học, an toàn và chuẩn y khoa cho người Việt.
        </p>

        {/* 3 Cam kết cốt lõi - Layout phẳng tinh tế không icon AI */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 w-full max-w-3xl pt-6 border-t border-white/15 text-center">
          <div className="py-2">
            <span className="text-xs tracking-[1.5px] uppercase font-semibold text-white block mb-1">
              100% Chính Hãng
            </span>
            <span className="text-[11px] text-neutral-400 font-light">
              Tuyển chọn chuẩn nguồn gốc quốc tế
            </span>
          </div>
          <div className="py-2 sm:border-x sm:border-white/15">
            <span className="text-xs tracking-[1.5px] uppercase font-semibold text-white block mb-1">
              Thành Phần Lành Tính
            </span>
            <span className="text-[11px] text-neutral-400 font-light">
              Kiểm nghiệm an toàn cho da nhạy cảm
            </span>
          </div>
          <div className="py-2">
            <span className="text-xs tracking-[1.5px] uppercase font-semibold text-white block mb-1">
              Routine Chu Đáo
            </span>
            <span className="text-[11px] text-neutral-400 font-light">
              Tư vấn phác đồ chuyên biệt từng nền da
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export { AboutHero };
