import video4 from "@/assets/video/About/video4.mp4";
import video5 from "@/assets/video/About/video5.mp4";
import aboutStoryPoster from "@/assets/img/about-story.jpg";

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
              poster={aboutStoryPoster}
              className="w-full aspect-[4/5] object-cover"
            >
              <source src={video4} type="video/mp4" />
            </video>
          </div>
          <div className="w-full md:w-1/2 md:pl-6">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900 uppercase tracking-wide">
              Câu Chuyện Của <br className="hidden md:block" /> HOÀNG BẢO COSMETICS
            </h2>
            <div className="w-16 h-1 bg-gray-900 mb-6"></div>
            <p className="text-gray-600 leading-loose mb-5 text-lg italic font-art">
              Khởi nguồn từ niềm đam mê nâng niu làn da Việt giữa thị trường mỹ phẩm phong phú nhưng cũng nhiều âu lo, HOÀNG BẢO COSMETICS ra đời không chỉ là một thương hiệu dược mỹ phẩm, mà là tiếng nói của sự an tâm và minh bạch. Chúng tôi chọn sự tối giản, lành tính làm ngôn ngữ, chọn chất lượng chuẩn y khoa làm nền tảng để làm nổi bật vẻ đẹp nguyên bản.
            </p>
            <p className="text-gray-600 leading-loose text-lg italic font-art">
              Dược mỹ phẩm với chúng tôi không phải là những lời hứa cấp tốc dư thừa, mà là sự tinh tế trong từng công thức hoạt chất, sự chăm chút trong từng thành phần tương thích sinh học, để mỗi cá nhân khi đồng hành cùng Hoàng Bảo đều cảm nhận được sự tự do, rạng rỡ và bản lĩnh.
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
            <p className="text-gray-600 leading-loose mb-5 text-lg italic font-art">
              Mang âm hưởng của phong cách chăm sóc da hiện đại và tối giản, HOÀNG BẢO COSMETICS hướng đến sự sang trọng ngầm (quiet luxury) trong chăm sóc da chuẩn y khoa. Sự phối hợp giữa chiết xuất thực vật thuần khiết và các hoạt chất vàng da liễu tạo nên một quy trình routine không bao giờ lỗi mốt, lành tính và đầy khí chất.
            </p>
            <p className="text-gray-600 leading-loose text-lg italic font-art">
              Hành trình của chúng tôi là định hình lại chuẩn mực của phong cách làm đẹp khoa học cho người Việt – nơi sự an toàn gặp gỡ sự đột phá, nơi mỗi sản phẩm là một tác phẩm nguyên bản.
            </p>
          </div>
          <div className="w-full md:w-1/2 overflow-hidden rounded-2xl shadow-xl group">
            <video
              autoPlay
              loop
              muted
              playsInline
              poster={aboutStoryPoster}
              className="w-full aspect-[4/5] object-cover"
            >
              <source src={video5} type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}

export { AboutStory };
