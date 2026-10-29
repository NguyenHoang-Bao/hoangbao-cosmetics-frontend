import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { Sparkles, ShieldCheck, HeartHandshake } from "lucide-react";

const heroBgImg =
  "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=2070&q=80&auto=format&fit=crop";

export default function AboutHero() {
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Trang chủ", link: "/" },
    { label: "Về chúng tôi" },
  ];

  return (
    <section className="relative w-full min-h-[380px] md:min-h-[460px] flex items-center justify-center text-center overflow-hidden bg-gray-900">
      {/* Ảnh nền mỹ phẩm sắc nét */}
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat transform scale-105 transition-transform duration-1000"
        style={{ backgroundImage: `url(${heroBgImg})` }}
      />

      {/* Lớp phủ gradient sang trọng màu hoa hồng & đen ánh nhung */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/80 backdrop-blur-[2px]" />

      {/* Họa tiết trang trí ánh sáng nhẹ */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Nội dung chính */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center">
        {/* Breadcrumb điều hướng */}
        <div className="mb-4">
          <Breadcrumb
            items={breadcrumbItems}
            className="justify-center text-gray-300 text-xs sm:text-sm font-medium [&_a]:text-gray-300 [&_a:hover]:text-rose-300 [&_span]:text-rose-200"
          />
        </div>

        {/* Badge nhỏ uy tín */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-rose-200 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-rose-300" />
          <span>Hoàng Bảo Cosmetics • Skincare & Beauty</span>
        </div>

        {/* Tiêu đề chính */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase text-white tracking-wide mb-5 max-w-4xl leading-tight">
          Về Chúng Tôi
        </h1>

        {/* Slogan & Giới thiệu ngắn */}
        <p className="text-base sm:text-lg md:text-xl text-rose-100/90 max-w-2xl font-light leading-relaxed mb-8">
          Tôn vinh vẻ đẹp thuần khiết nguyên bản &mdash; Hành trình mang đến giải pháp chăm sóc da khoa học, an toàn và chuẩn y khoa cho người Việt.
        </p>

        {/* 3 cam kết nhỏ ngay trên hero */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 w-full max-w-2xl text-left">
          <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/15 text-white/90 text-xs sm:text-sm">
            <ShieldCheck className="w-4 h-4 text-rose-300 flex-shrink-0" />
            <span className="font-medium">100% Chính Hãng Chuẩn Hãng</span>
          </div>
          <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/15 text-white/90 text-xs sm:text-sm">
            <Sparkles className="w-4 h-4 text-rose-300 flex-shrink-0" />
            <span className="font-medium">Thành Phần Lành Tính</span>
          </div>
          <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/15 text-white/90 text-xs sm:text-sm">
            <HeartHandshake className="w-4 h-4 text-rose-300 flex-shrink-0" />
            <span className="font-medium">Tư Vấn Routine Chu Đáo</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export { AboutHero };
