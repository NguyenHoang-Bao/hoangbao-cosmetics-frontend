import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Sparkles,
  HeartHandshake,
  Leaf,
  Award,
  Users,
  ArrowRight,
  Smile,
} from "lucide-react";

export default function AboutCoreValues() {
  const coreValues = [
    {
      icon: ShieldCheck,
      badge: "01 / MINH BẠCH",
      title: "100% Chính Hãng Cam Kết",
      desc: "Tuyển chọn trực tiếp từ các tập đoàn dược mỹ phẩm uy tín trên thế giới. 100% sản phẩm có tem chống giả, nhãn phụ tiếng Việt và hóa đơn nguồn gốc rõ ràng.",
    },
    {
      icon: Sparkles,
      badge: "02 / CHUẨN Y KHOA",
      title: "Công Thức Lành Tính & An Toàn",
      desc: "Nói không với các thành phần gây hại như cồn khô kích ứng, paraben, corticoid hay chất tạo màu độc hại. An toàn tuyệt đối cho cả làn da nhạy cảm nhất.",
    },
    {
      icon: HeartHandshake,
      badge: "03 / TẬN TÂM",
      title: "Tư Vấn Routine Cá Nhân Hóa",
      desc: "Chúng tôi không bán hàng theo trào lưu ngắn hạn. Đội ngũ chuyên viên luôn soi da, lắng nghe tình trạng nền da để xây dựng phác đồ chăm sóc phù hợp và hiệu quả nhất.",
    },
    {
      icon: Leaf,
      badge: "04 / BỀN VỮNG",
      title: "Clean Beauty & Nhân Đạo",
      desc: "Ưu tiên các dòng mỹ phẩm thuần chay (Vegan), cam kết Cruelty-free không thử nghiệm trên động vật và sử dụng bao bì đóng gói thân thiện với môi trường.",
    },
  ];

  const milestones = [
    {
      icon: Users,
      value: "50.000+",
      label: "Khách hàng tin tưởng đồng hành",
    },
    {
      icon: Award,
      value: "200+",
      label: "Thương hiệu dược mỹ phẩm hàng đầu",
    },
    {
      icon: ShieldCheck,
      value: "100%",
      label: "Cam kết chuẩn hãng đền gấp 10",
    },
    {
      icon: Smile,
      value: "99.2%",
      label: "Khách hàng đánh giá hài lòng 5 sao",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-white via-rose-50/40 to-white py-16 md:py-24 border-t border-rose-100/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Giá trị cốt lõi */}
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-16">
          <span className="text-xs sm:text-sm font-bold tracking-[3px] text-rose-500 uppercase block mb-3">
            TIÊU CHUẨN HOÀNG BẢO
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Giá Trị Cốt Lõi Tạo Nên Sự Khác Biệt
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-rose-500 to-pink-400 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-gray-600 text-sm sm:text-base leading-relaxed">
            Mỗi bước đi của Hoàng Bảo Cosmetics đều dựa trên sự chính trực, tôn trọng làn da và khát khao nâng tầm vẻ đẹp Việt.
          </p>
        </div>

        {/* Lưới 4 thẻ Giá trị cốt lõi */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-20">
          {coreValues.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-7 border border-rose-100/80 shadow-sm hover:shadow-xl hover:border-rose-300 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-6 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300 shadow-sm">
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-[11px] font-bold text-rose-500 tracking-wider uppercase block mb-2">
                    {item.badge}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-rose-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-xs font-semibold text-rose-500 group-hover:text-rose-600">
                  <span>Tiêu chuẩn chất lượng</span>
                  <Sparkles className="w-3.5 h-3.5 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Trích dẫn nghệ thuật (Brand Mission Statement) */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="relative bg-white rounded-3xl p-8 sm:p-12 border border-rose-200/80 shadow-lg text-center overflow-hidden">
            {/* Họa tiết góc */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100/50 rounded-bl-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-100/50 rounded-tr-full pointer-events-none" />

            <span className="text-6xl sm:text-7xl text-rose-300 font-serif leading-none block mb-2 select-none">
              “
            </span>
            <blockquote className="relative z-10 text-lg sm:text-xl md:text-2xl text-gray-700 leading-relaxed font-art italic max-w-3xl mx-auto">
              Tại <span className="text-rose-600 font-bold not-italic">Hoàng Bảo Cosmetics</span>, mỗi sản phẩm trao đi không đơn thuần là một lọ dưỡng ẩm hay một cây son, mà là một lời hứa trân quý về sức khỏe, sự nâng niu và niềm tự tin của bạn mỗi sớm mai thức giấc.
            </blockquote>
            <div className="mt-6 flex flex-col items-center">
              <span className="w-12 h-0.5 bg-rose-400 rounded-full mb-3" />
              <span className="text-sm font-bold text-gray-900 tracking-wider uppercase font-sans">
                Đội Ngũ Sáng Lập Hoàng Bảo Cosmetics
              </span>
              <span className="text-xs text-rose-500 mt-0.5">
                Chuyên Gia Da Liễu & Nghiên Cứu Mỹ Phẩm
              </span>
            </div>
          </div>
        </div>

        {/* Dải thống kê con số ấn tượng */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-3xl p-8 sm:p-10 text-white shadow-xl mb-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/20">
            {milestones.map((ms, idx) => {
              const Icon = ms.icon;
              return (
                <div key={idx} className="flex flex-col items-center pt-6 sm:pt-0 px-2">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-1">
                    {ms.value}
                  </span>
                  <span className="text-xs sm:text-sm text-rose-100 font-medium max-w-[180px] leading-snug">
                    {ms.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Khối Banner Call to Action (CTA) */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-rose-100 shadow-sm text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold text-rose-500 uppercase tracking-widest block mb-2">
            ĐỒNG HÀNH CÙNG LÀN DA BẠN
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">
            Sẵn Sàng Bắt Đầu Routine Chuẩn Y Khoa Cùng Hoàng Bảo?
          </h3>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
            Khám phá hàng ngàn sản phẩm dưỡng da và trang điểm chính hãng hoặc kết nối ngay với dược sĩ của chúng tôi để được tư vấn miễn phí.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
            >
              <span>Xem Tất Cả Sản Phẩm</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl border border-rose-200 transition-all duration-200"
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
