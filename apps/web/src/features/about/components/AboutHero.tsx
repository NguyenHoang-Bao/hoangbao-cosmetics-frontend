import Breadcrumb, { type BreadcrumbItem } from "@/components/ui/Breadcrumb";

export default function AboutHero() {
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Trang chủ", link: "/" },
    { label: "Về chúng tôi" },
  ];

  return (
    <section className="bg-[#F6F4F0] pt-12 md:pt-16 pb-20 md:pb-28 border-b border-stone-200/70">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Breadcrumb điều hướng phong cách tối giản */}
        <div className="mb-8">
          <Breadcrumb
            items={breadcrumbItems}
            className="justify-center text-stone-500 text-xs font-mono uppercase tracking-[2px] [&_a]:text-stone-500 [&_a:hover]:text-stone-900 [&_span]:text-stone-900"
          />
        </div>

        {/* Archival Label - Không gian Atelier */}
        <span className="text-xs font-mono uppercase tracking-[3px] text-stone-500 block mb-6">
          [ Hoàng Bảo Cosmetics &bull; Triết Lý Về Làn Da Tĩnh Lặng ]
        </span>

        {/* Tiêu đề chính đậm chất thơ & nghệ thuật */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-light font-art italic text-stone-900 leading-[1.18] tracking-tight mb-8">
          Sự lắng nghe tận tâm dành cho từng cấu trúc da.
        </h1>

        {/* Đoạn mở đầu thư thả, súc tích */}
        <p className="text-base sm:text-lg text-stone-600 font-light leading-relaxed max-w-2xl mx-auto">
          Chúng tôi tin rằng việc chăm sóc da không phải là một chuỗi hành động gấp gáp, mà là một khoảng lặng chữa lành sau những ồn ào của nhịp sống hiện đại.
        </p>

        {/* Đường gạch ngang tối giản ngăn cách */}
        <div className="w-12 h-px bg-stone-300 mx-auto mt-12" />
      </div>
    </section>
  );
}

export { AboutHero };
