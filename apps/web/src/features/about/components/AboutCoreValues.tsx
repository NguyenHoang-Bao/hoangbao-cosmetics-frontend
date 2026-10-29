import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function AboutCoreValues() {
  const coreValues = [
    {
      num: "01",
      category: "Minh Bạch Nguồn Gốc",
      title: "100% Chính Hãng Cam Kết",
      desc: "Tuyển chọn trực tiếp từ các tập đoàn dược mỹ phẩm uy tín trên thế giới. 100% sản phẩm có tem chống giả, nhãn phụ tiếng Việt và hóa đơn nguồn gốc rõ ràng.",
    },
    {
      num: "02",
      category: "Chuẩn Y Khoa",
      title: "Công Thức Lành Tính & An Toàn",
      desc: "Nói không với các thành phần gây hại như cồn khô kích ứng, paraben, corticoid hay chất tạo màu độc hại. An toàn tuyệt đối cho cả làn da nhạy cảm nhất.",
    },
    {
      num: "03",
      category: "Tận Tâm Đồng Hành",
      title: "Tư Vấn Routine Cá Nhân Hóa",
      desc: "Chúng tôi không bán hàng theo trào lưu ngắn hạn. Đội ngũ chuyên viên luôn soi da, lắng nghe tình trạng nền da để xây dựng phác đồ chăm sóc phù hợp và hiệu quả nhất.",
    },
    {
      num: "04",
      category: "Bền Vững & Nhân Đạo",
      title: "Clean Beauty & Nhân Đạo",
      desc: "Ưu tiên các dòng mỹ phẩm thuần chay (Vegan), cam kết Cruelty-free không thử nghiệm trên động vật và sử dụng bao bì đóng gói thân thiện với môi trường.",
    },
  ];

  const milestones = [
    {
      value: "50.000+",
      label: "Khách hàng tin tưởng đồng hành",
    },
    {
      value: "200+",
      label: "Thương hiệu dược mỹ phẩm hàng đầu",
    },
    {
      value: "100%",
      label: "Cam kết chuẩn hãng đền gấp 10",
    },
    {
      value: "99.2%",
      label: "Khách hàng đánh giá hài lòng 5 sao",
    },
  ];

  return (
    <section className="bg-white py-20 md:py-32 border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Giá trị cốt lõi */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
          <span className="text-xs font-semibold tracking-[3px] text-rose-600 uppercase block mb-3">
            Tiêu Chuẩn Hoàng Bảo
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-neutral-900 tracking-tight leading-tight">
            Giá Trị Cốt Lõi Tạo Nên Sự Khác Biệt
          </h2>
          <div className="w-12 h-px bg-neutral-900 mx-auto mt-6" />
          <p className="mt-6 text-neutral-600 text-sm sm:text-base leading-relaxed font-light">
            Mỗi bước đi của Hoàng Bảo Cosmetics đều dựa trên sự chính trực, tôn trọng làn da và khát khao nâng tầm vẻ đẹp thuần khiết Việt.
          </p>
        </div>

        {/* Lưới 4 Giá trị cốt lõi - Minimal Grid phân chia thanh lịch, loại bỏ icon AI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-24 lg:mb-32">
          {coreValues.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between p-8 rounded-2xl bg-neutral-50/70 border border-neutral-100 hover:border-neutral-300 transition-colors duration-300"
            >
              <div>
                <span className="text-xs font-mono font-medium text-neutral-400 tracking-wider block mb-2">
                  {item.num}
                </span>
                <span className="text-[11px] font-bold text-rose-600 tracking-wider uppercase block mb-4">
                  {item.category}
                </span>
                <h3 className="text-lg font-semibold text-neutral-900 mb-3 leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Trích dẫn nghệ thuật (Brand Mission Statement) */}
        <div className="max-w-4xl mx-auto mb-24 lg:mb-32">
          <div className="relative bg-neutral-50 rounded-3xl p-10 sm:p-16 border border-neutral-100 text-center">
            <span className="text-5xl sm:text-6xl text-neutral-300 font-serif leading-none block mb-4 select-none">
              &ldquo;
            </span>
            <blockquote className="relative z-10 text-lg sm:text-xl md:text-2xl text-neutral-800 leading-relaxed font-art italic max-w-3xl mx-auto mb-8">
              Tại <span className="text-neutral-900 font-semibold not-italic">Hoàng Bảo Cosmetics</span>, mỗi sản phẩm trao đi không đơn thuần là một lọ dưỡng ẩm hay một cây son, mà là một lời hứa trân quý về sức khỏe, sự nâng niu và niềm tự tin của bạn mỗi sớm mai thức giấc.
            </blockquote>
            <div className="flex flex-col items-center">
              <span className="w-8 h-px bg-neutral-400 mb-3" />
              <span className="text-xs font-bold text-neutral-900 tracking-[2px] uppercase">
                Đội Ngũ Sáng Lập Hoàng Bảo Cosmetics
              </span>
              <span className="text-xs text-neutral-500 mt-1">
                Chuyên Gia Da Liễu &bull; Nghiên Cứu Mỹ Phẩm Chuẩn Y Khoa
              </span>
            </div>
          </div>
        </div>

        {/* Dải thống kê con số - Phong cách Luxury Minimal, loại bỏ gradient neon */}
        <div className="bg-neutral-950 text-white rounded-3xl p-10 sm:p-14 shadow-lg mb-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-neutral-800">
            {milestones.map((ms, idx) => (
              <div key={idx} className="flex flex-col items-center pt-6 sm:pt-0 px-3">
                <span className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight mb-2 text-white">
                  {ms.value}
                </span>
                <span className="text-xs sm:text-sm text-neutral-400 font-light max-w-[190px] leading-snug">
                  {ms.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Khối Banner Call to Action (CTA) thanh lịch */}
        <div className="rounded-3xl p-10 sm:p-14 border border-neutral-200 text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold text-neutral-400 tracking-[3px] uppercase block mb-3">
            Đồng Hành Cùng Làn Da Bạn
          </span>
          <h3 className="text-2xl sm:text-3xl font-light text-neutral-900 mb-4 tracking-tight">
            Sẵn Sàng Bắt Đầu Routine Chuẩn Y Khoa Cùng Hoàng Bảo?
          </h3>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto font-light">
            Khám phá hàng ngàn sản phẩm dưỡng da và trang điểm chính hãng hoặc kết nối ngay với chuyên viên của chúng tôi để được tư vấn miễn phí.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-neutral-900 hover:bg-black text-white font-medium text-xs tracking-wider uppercase rounded-full shadow-xs hover:shadow-md transition-all duration-300"
            >
              <span>Xem Tất Cả Sản Phẩm</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 font-medium text-xs tracking-wider uppercase rounded-full border border-neutral-300 transition-all duration-300"
            >
              <span>Tư Vấn Soi Da Miễn Phí</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export { AboutCoreValues };
