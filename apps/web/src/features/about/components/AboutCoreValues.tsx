import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Sparkles,
  HeartHandshake,
  Leaf,
  Award,
  Users,
  Smile,
  ArrowRight,
} from "lucide-react";

export const AboutCoreValues: React.FC = () => {
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
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight">
            Giá Trị Cốt Lõi Tạo Nên Sự Khác Biệt
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-rose-500 to-pink-400 mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-neutral-600 text-sm sm:text-base leading-relaxed">
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
                className="bg-white rounded-2xl p-7 border border-rose-100/80 shadow-xs hover:shadow-xl hover:border-rose-300 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-6 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300 shadow-xs">
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-[11px] font-bold text-rose-500 tracking-wider uppercase block mb-2">
                    {item.badge}
                  </span>
                  <h3 className="text-lg font-bold text-neutral-900 mb-3 group-hover:text-rose-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Khối Cột mốc số liệu thống kê */}
        <div className="bg-neutral-900 text-white rounded-3xl p-8 sm:p-12 mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-neutral-800">
            {milestones.map((milestone, idx) => {
              const MIcon = milestone.icon;
              return (
                <div key={idx} className="pt-6 lg:pt-0 lg:px-4">
                  <MIcon className="w-8 h-8 text-rose-400 mx-auto mb-3" />
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-2 tracking-tight">
                    {milestone.value}
                  </div>
                  <p className="text-neutral-400 text-xs sm:text-sm font-medium">
                    {milestone.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Khối Kêu gọi hành động (CTA) */}
        <div className="text-center max-w-xl mx-auto space-y-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
            Sẵn Sàng Cho Làn Da Tỏa Sáng?
          </h3>
          <p className="text-sm text-neutral-600">
            Khám phá ngay các dòng sản phẩm chính hãng phù hợp với tình trạng da của bạn tại Hoàng Bảo Cosmetics.
          </p>
          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-bold uppercase tracking-wider shadow-md shadow-rose-200 transition-all hover:gap-3"
            >
              <span>Khám Phá Sản Phẩm Ngay</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
