import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface SkinGalleryItem {
  number: string;
  category: string;
  title: string;
  tagline: string;
  actives: string;
  productCount: string;
  image: string;
  link: string;
  // Tone màu pastel độc bản cho từng loại da
  bgColor: string;
  borderColor: string;
  accentColor: string;
  badgeBg: string;
}

const SKIN_GALLERY: readonly SkinGalleryItem[] = [
  {
    number: "01",
    category: "DẦU MỤN",
    title: "Kiểm Soát Bã Nhờn",
    tagline: "Thanh lọc lỗ chân lông, làm sạch dầu thừa và làm dịu các nốt mụn viêm sưng.",
    actives: "Salicylic Acid (BHA) • Niacinamide",
    productCount: "16 SP",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&auto=format&fit=crop",
    link: "/products?search=da+dầu",
    bgColor: "bg-[#EFF4F0]",
    borderColor: "border-[#E0ECE2] hover:border-emerald-600",
    accentColor: "text-emerald-800",
    badgeBg: "text-emerald-800 bg-white/80",
  },
  {
    number: "02",
    category: "CẤP ẨM",
    title: "Khóa Ẩm Đa Tầng",
    tagline: "Cấp ẩm sâu suốt 48h và phục hồi màng lipid tự nhiên giúp da luôn căng mọng.",
    actives: "Hyaluronic Acid • Ceramide NP",
    productCount: "14 SP",
    image: "https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=800&auto=format&fit=crop",
    link: "/products?search=da+khô",
    bgColor: "bg-[#EFF4F8]",
    borderColor: "border-[#DEEAF2] hover:border-sky-600",
    accentColor: "text-sky-800",
    badgeBg: "text-sky-800 bg-white/80",
  },
  {
    number: "03",
    category: "PHỤC HỒI",
    title: "Dịu Nhẹ Lành Tính",
    tagline: "100% không cồn, giảm ửng đỏ tức thì và củng cố hàng rào phòng vệ tự nhiên.",
    actives: "Panthenol B5 • Rau Má Centella",
    productCount: "12 SP",
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?w=800&auto=format&fit=crop",
    link: "/products?search=nhạy+cảm",
    bgColor: "bg-[#F9ECE8]",
    borderColor: "border-[#F2DDD7] hover:border-rose-600",
    accentColor: "text-rose-800",
    badgeBg: "text-rose-800 bg-white/80",
  },
  {
    number: "04",
    category: "TRẺ HÓA",
    title: "Tăng Sinh Collagen",
    tagline: "Nâng cơ săn chắc, làm mờ nếp nhăn và cải thiện độ đàn hồi thanh xuân.",
    actives: "Pure Retinol • Multi-Peptides",
    productCount: "10 SP",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop",
    link: "/products?search=lão+hóa",
    bgColor: "bg-[#F7EFE5]",
    borderColor: "border-[#EFE2D2] hover:border-amber-700",
    accentColor: "text-amber-900",
    badgeBg: "text-amber-900 bg-white/80",
  },
];

export const ShopBySkinType: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── HEADER CURATED GALLERY ── */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <span className="font-mono text-[11px] sm:text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-2">
            [ THE CURATED SKINCARE GALLERY ]
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-neutral-900">
            Giải Pháp Theo Loại Da
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2.5 leading-relaxed">
            Mỗi làn da mang một cơ chế sinh học riêng biệt. Tuyển chọn các giải pháp đặc trị
            kết hợp hoạt chất đích thực theo chuẩn da liễu.
          </p>
        </div>

        {/* ── LƯỚI 4 KHỐI PASTEL TỰ NHIÊN ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SKIN_GALLERY.map((item) => (
            <Link
              key={item.number}
              to={item.link}
              className={`${item.bgColor} border ${item.borderColor} rounded-3xl p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer`}
            >
              <div>
                {/* Hàng Header Thẻ: Số thứ tự + Tag số lượng */}
                <div className="flex justify-between items-center text-xs font-mono font-bold">
                  <span className={item.accentColor}>
                    {item.number} / {item.category}
                  </span>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-2xs ${item.badgeBg}`}>
                    {item.productCount}
                  </span>
                </div>

                {/* Khung ảnh Texture Studio tròn trịa nổi bật */}
                <div className="w-full aspect-square my-5 rounded-2xl overflow-hidden bg-white/90 p-3 shadow-2xs border border-white/60 flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-xl group-hover:scale-106 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                </div>

                {/* Tiêu đề & Hoạt chất & Mô tả */}
                <span className={`text-[10px] font-mono uppercase font-bold tracking-wider ${item.accentColor}`}>
                  {item.actives}
                </span>
                <h3 className="font-extrabold text-lg sm:text-xl uppercase text-neutral-900 mt-1 leading-snug group-hover:text-rose-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed line-clamp-2">
                  {item.tagline}
                </p>
              </div>

              {/* Hàng dưới cùng: Link khám phá chu trình */}
              <div className="mt-6 pt-3.5 border-t border-black/5 flex items-center justify-between">
                <span className={`text-xs font-bold uppercase tracking-wider ${item.accentColor} group-hover:underline underline-offset-4`}>
                  Khám phá chu trình
                </span>
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-2xs group-hover:translate-x-1 transition-transform">
                  <ArrowRight className={`w-3.5 h-3.5 ${item.accentColor}`} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── NÚT KHÁM PHÁ TOÀN BỘ SẢN PHẨM THEO DA ── */}
        <div className="mt-12 sm:mt-14 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-neutral-900 hover:bg-[#0F1E36] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg active:scale-98 group"
          >
            <span>Khám phá toàn bộ giải pháp cho da</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ShopBySkinType;
