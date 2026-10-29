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
              Khởi nguồn từ niềm đam mê nâng niu làn da Việt giữa thị trường mỹ phẩm phong phú nhưng cũng nhiều âu lo, HOÀNG BẢO COSMETICS ra đời không chỉ là một thương hiệu dược mỹ phẩm, mà là tiếng nói của sự an tâm và minh bạch. Chúng tôi chọn sự tối giản làm ngôn ngữ, chọn chất lượng chuẩn y khoa làm nền tảng để tôn vinh vẻ đẹp nguyên bản.
            </p>
            <p className="text-gray-600 leading-loose text-lg italic">
              Dược mỹ phẩm với chúng tôi không phải là những phép màu cấp tốc gây bào mòn, mà là sự tinh tế trong từng đường nét chăm sóc, sự chăm chút trong từng hoạt chất lành tính, để mỗi cá nhân khi đồng hành cùng Hoàng Bảo đều cảm nhận được sự tự do và bản lĩnh.
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
              Mang âm hưởng của phong cách chăm sóc da hiện đại và khoa học, HOÀNG BẢO COSMETICS hướng đến sự sang trọng ngầm (quiet luxury) trong dược mỹ phẩm. Sự phối hợp giữa các hoạt chất vàng da liễu và chiết xuất tự nhiên lành tính tạo nên một chu trình routine không bao giờ lỗi mốt, lành tính và đầy khí chất.
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
