import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function AboutCoreValues() {
  return (
    <section className="bg-neutral-50/60 py-24 md:py-36 border-b border-neutral-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Dấu ngoặc kép nghệ thuật */}
        <span className="text-4xl sm:text-5xl text-neutral-300 font-serif leading-none block mb-6 select-none">
          &ldquo;
        </span>

        {/* Tuyên ngôn thương hiệu thanh lịch */}
        <blockquote className="text-xl sm:text-2xl md:text-3xl text-neutral-800 leading-relaxed font-art italic max-w-3xl mx-auto mb-10">
          Tại Hoàng Bảo Cosmetics, mỗi sản phẩm trao đi là một cam kết về sức khỏe của làn da. Chúng tôi không theo đuổi trào lưu ngắn hạn, mà cùng bạn xây dựng thói quen chăm sóc da an toàn và bền vững.
        </blockquote>

        {/* Ký tên tinh tế */}
        <div className="flex flex-col items-center mb-16">
          <span className="w-8 h-px bg-neutral-300 mb-4" />
          <span className="text-xs font-semibold text-neutral-900 tracking-[3px] uppercase">
            Đội Ngũ Hoàng Bảo Cosmetics
          </span>
          <span className="text-xs text-neutral-500 font-light mt-1">
            Dược Mỹ Phẩm Chính Hãng Chuẩn Y Khoa
          </span>
        </div>

        {/* Link điều hướng tối giản sang sản phẩm */}
        <div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-[2px] uppercase text-neutral-900 hover:text-rose-600 border-b border-neutral-900 hover:border-rose-600 pb-1.5 transition-colors duration-200"
          >
            <span>Khám phá các dòng sản phẩm chính hãng</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export { AboutCoreValues };
