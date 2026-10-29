import Breadcrumb, { type BreadcrumbItem } from "@/components/ui/Breadcrumb";

const heroBgImg =
  "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=2070&q=80&auto=format&fit=crop";

export default function AboutHero() {
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Trang chủ", link: "/" },
    { label: "Về chúng tôi" },
  ];

  return (
    <section className="relative w-full min-h-[380px] md:min-h-[460px] flex items-center justify-center text-center overflow-hidden bg-neutral-950">
      {/* Background Image với lớp mờ tối giản chuẩn Studio */}
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat transform scale-102 transition-transform duration-1000 opacity-60"
        style={{ backgroundImage: `url(${heroBgImg})` }}
      />

      {/* Lớp phủ đen nhung điện ảnh */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-black/90" />

      {/* Nội dung chính */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center">
        {/* Breadcrumb điều hướng */}
        <div className="mb-6">
          <Breadcrumb
            items={breadcrumbItems}
            className="justify-center text-neutral-400 text-xs tracking-wider uppercase font-medium [&_a]:text-neutral-400 [&_a:hover]:text-white [&_span]:text-neutral-300"
          />
        </div>

        {/* Eyebrow Label thanh mảnh */}
        <span className="text-[11px] tracking-[4px] uppercase text-neutral-300 font-medium mb-3 block">
          Hoàng Bảo Cosmetics
        </span>

        {/* Tiêu đề chính */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-[2px] uppercase text-white mb-5 leading-tight">
          Về Chúng Tôi
        </h1>

        {/* Tuyên ngôn cô đọng */}
        <p className="text-sm sm:text-base md:text-lg text-neutral-300 font-light tracking-wide max-w-xl leading-relaxed">
          Giải pháp chăm sóc da khoa học, minh bạch nguồn gốc và tương thích sinh học với làn da người Việt.
        </p>
      </div>
    </section>
  );
}

export { AboutHero };
