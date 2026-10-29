import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function AboutCoreValues() {
  return (
    <section className="bg-white py-24 md:py-36 border-t border-stone-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        {/* Dấu ngoặc kép thanh nhã */}
        <span className="text-5xl sm:text-6xl text-stone-300 font-serif leading-none block select-none">
          &ldquo;
        </span>

        {/* Tuyên ngôn thương hiệu phong cách Aesop */}
        <blockquote className="text-xl sm:text-2xl md:text-3xl text-stone-800 leading-relaxed font-art italic max-w-3xl mx-auto">
          Tại Hoàng Bảo Cosmetics, mỗi sản phẩm trao đi là một lời hứa danh dự về sự an tâm của bạn. Chúng tôi không theo đuổi những phép màu cấp tốc, mà cùng bạn nuôi dưỡng làn da khỏe mạnh, tự do và bản lĩnh qua từng tháng năm.
        </blockquote>

        {/* Chữ ký & Tem xuất xứ Atelier */}
        <div className="flex flex-col items-center space-y-2 pt-4">
          <span className="w-8 h-px bg-stone-300 mb-4" />
          <span className="text-xs font-mono uppercase tracking-[3px] text-stone-900 font-medium">
            Đội Ngũ Sáng Lập Hoàng Bảo Cosmetics
          </span>
          <span className="text-xs text-stone-500 font-mono tracking-wider">
            Sài Gòn &bull; Est. 2026 &bull; Dược Mỹ Phẩm Chính Hãng
          </span>
        </div>

        {/* Nút bấm tối giản Atelier */}
        <div className="pt-6">
          <Link
            to="/products"
            className="inline-flex items-center gap-3 px-8 py-4 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded-full text-xs font-mono uppercase tracking-[2px] transition-all duration-300 shadow-xs hover:shadow-md"
          >
            <span>Khám phá bộ sưu tập dược mỹ phẩm</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export { AboutCoreValues };
