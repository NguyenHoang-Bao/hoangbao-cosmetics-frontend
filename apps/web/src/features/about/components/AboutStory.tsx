import videoStory1 from "@/assets/video/About/video_skincare_story1.mp4";
import videoStory2 from "@/assets/video/About/video_skincare_story2.mp4";

export default function AboutStory() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Khối 1: Video Trái - Text Phải */}
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 mb-20">
          <div className="w-full md:w-1/2 overflow-hidden rounded-2xl shadow-xl group">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full aspect-[4/5] object-cover"
            >
              <source src={videoStory1} type="video/mp4" />
            </video>
          </div>
          <div className="w-full md:w-1/2 md:pl-6">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900 uppercase tracking-wide">
              Câu Chuyện Của <br className="hidden md:block" /> HOÀNG BẢO COSMETICS
            </h2>
            <div className="w-16 h-1 bg-gray-900 mb-6"></div>
            <p className="text-gray-600 leading-loose mb-5 text-lg italic">
              Hoàng Bảo Cosmetics ra đời từ chính trải nghiệm thực tế: tụi mình từng là những người trẻ loay hoay vì mụn, từng hoang mang giữa một thị trường mỹ phẩm vàng thau lẫn lộn và nhiều lần thất vọng vì mua nhầm hàng xách tay kém chất lượng. Tụi mình hiểu cảm giác tự ti mỗi khi soi gương và nỗi bất an khi đặt niềm tin sai chỗ.
            </p>
            <p className="text-gray-600 leading-loose text-lg italic">
              Bởi vậy, Hoàng Bảo chọn một con đường giản dị nhưng kiên định: Chỉ bán hàng chính hãng có tem phụ, có hóa đơn rõ ràng. Tụi mình không bao giờ cổ xúy cho những lời quảng cáo "trắng cấp tốc, hết mụn sau 3 ngày" bào mòn da, mà kiên trì mang đến những giải pháp dưỡng da lành tính, khoa học và bền vững.
            </p>
          </div>
        </div>

        {/* Khối 2: Text Trái - Video Phải */}
        <div className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16">
          <div className="w-full md:w-1/2 md:pr-6 mt-10 md:mt-0">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900 uppercase tracking-wide">
              Tầm Nhìn &amp; Phong Cách
            </h2>
            <div className="w-16 h-1 bg-gray-900 mb-6"></div>
            <p className="text-gray-600 leading-loose mb-5 text-lg italic">
              Chúng mình không định vị là một cửa hàng xa xỉ khó với, mà muốn trở thành "trạm dừng chân an tâm" của mọi cô gái, chàng trai yêu cái đẹp. Dù bạn là bạn học sinh tiết kiệm từng bữa ăn sáng để mua cây son dưỡng hay là người đi làm cần tìm bộ treatment phục hồi chuyên sâu, bạn đều được phục vụ bằng tất cả sự chân thành.
            </p>
            <p className="text-gray-600 leading-loose text-lg italic">
              Hành trình của chúng tôi là định hình lại chuẩn mực chăm sóc da của người Việt &mdash; nơi sự tối giản gặp gỡ hiệu quả y khoa, nơi mỗi sản phẩm là một tác phẩm nguyên bản.
            </p>
          </div>
          <div className="w-full md:w-1/2 overflow-hidden rounded-2xl shadow-xl group">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full aspect-[4/5] object-cover"
            >
              <source src={videoStory2} type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}

export { AboutStory };
