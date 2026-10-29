import videoNhanSac from "@/assets/video/video_nhansac.mp4";

export default function AboutStory() {
  return (
    <section className="bg-[#F6F4F0] py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 md:space-y-36">
        {/* Khối 1: Video Tĩnh Lặng Trái - Tiểu luận Nghệ thuật Phải */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Video Khung viền ấm áp */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden bg-stone-200 aspect-[4/5] shadow-sm border border-stone-300/60">
              <video
                autoPlay
                loop
                muted
                playsInline
                src={videoNhanSac}
                className="w-full h-full object-cover"
              >
                <source src={videoNhanSac} type="video/mp4" />
              </video>
              <div className="absolute bottom-6 left-6 bg-stone-900/80 backdrop-blur-sm text-stone-100 text-[11px] font-mono px-4 py-2 rounded-full uppercase tracking-wider">
                Atelier Skincare &bull; Slow Beauty
              </div>
            </div>
          </div>

          {/* Lời tự sự sâu lắng */}
          <div className="lg:col-span-6 space-y-8">
            <span className="text-xs font-mono uppercase tracking-[3px] text-stone-400 block">
              [ 01 &bull; KHỞI NGUỒN ]
            </span>

            <h2 className="text-2xl sm:text-4xl font-light font-art text-stone-900 leading-snug">
              Chọn lọc từng giọt tinh túy từ thiên nhiên &amp; khoa học.
            </h2>

            <p className="text-stone-600 leading-relaxed font-light text-base sm:text-lg">
              Mỗi dòng sản phẩm xuất hiện tại Hoàng Bảo Cosmetics đều trải qua quá trình thử nghiệm khắt khe trên nhiều nền da châu Á. Chúng tôi chú trọng cảm giác mịn mượt khi chạm vào da, khả năng thẩm thấu sâu và bảng thành phần lành tính không hương liệu hóa chất.
            </p>

            <p className="text-stone-600 leading-relaxed font-light text-base sm:text-lg">
              Chúng tôi không chạy theo những trào lưu lột tẩy nhanh khiến lớp màng lipid bị thương tổn. Thay vào đó, mỗi công thức được tuyển chọn đều nhằm củng cố và nuôi dưỡng tế bào da khỏe mạnh từ gốc rễ.
            </p>

            {/* Thẻ cam kết Atelier nền giấy trắng ấm áp */}
            <div className="p-8 bg-white rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
              <span className="text-xs font-mono uppercase tracking-[2px] text-stone-400 block">
                Cam Kết Cốt Lõi
              </span>
              <p className="text-sm sm:text-base text-stone-800 font-light leading-relaxed">
                Chỉ phân phối những sản phẩm mà chính đội ngũ sáng lập tự tin sử dụng hàng ngày cho bản thân và gia đình.
              </p>
            </div>
          </div>
        </div>

        {/* Khối 2: Ba Khoảng Lặng Chăm Sóc Da (Three Mindful Principles) */}
        <div className="pt-16 border-t border-stone-300/80">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-[3px] text-stone-400 block mb-3">
              [ 02 &bull; NGUYÊN TẮC ]
            </span>
            <h3 className="text-2xl sm:text-3xl font-light font-art text-stone-900">
              Ba giá trị bất biến trong từng phác đồ
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-stone-200/80 space-y-4">
              <span className="text-xs font-mono text-stone-400 block">01 / NGUỒN GỐC</span>
              <h4 className="text-lg font-medium text-stone-900">Minh Bạch Tuyệt Đối</h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                100% sản phẩm có tem chống giả, tem phụ hướng dẫn và mã vạch truy xuất nguồn gốc từ các tập đoàn dược mỹ phẩm quốc tế.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-stone-200/80 space-y-4">
              <span className="text-xs font-mono text-stone-400 block">02 / CÔNG THỨC</span>
              <h4 className="text-lg font-medium text-stone-900">Tương Thích Tự Nhiên</h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                Nói không với cồn khô, paraben và các hoạt chất bào mòn. Tôn trọng sinh lý tự nhiên của từng tế bào biểu bì.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-stone-200/80 space-y-4">
              <span className="text-xs font-mono text-stone-400 block">03 / ĐỒNG HÀNH</span>
              <h4 className="text-lg font-medium text-stone-900">Lắng Nghe &amp; Thấu Hiểu</h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                Đội ngũ chuyên viên tư vấn luôn đồng hành lắng nghe tình trạng da thực tế để xây dựng liệu trình phù hợp nhất cho bạn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { AboutStory };
