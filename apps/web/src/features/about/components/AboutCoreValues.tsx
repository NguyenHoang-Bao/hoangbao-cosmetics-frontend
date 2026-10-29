export default function AboutCoreValues() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 uppercase tracking-wider">
            Giá Trị Cốt Lõi
          </h2>
          <div className="mx-auto bg-gray-900 mt-6 w-20 h-1"></div>
        </div>
        <div className="max-w-3xl mx-auto text-center relative px-8">
          <span className="absolute top-0 start-0 text-7xl md:text-8xl text-gray-200 opacity-75 transform -translate-x-4 -translate-y-6 select-none font-serif leading-none">
            &ldquo;
          </span>
          <p className="relative text-xl md:text-2xl text-gray-600 leading-relaxed italic">
            Tại HOÀNG BẢO COSMETICS, mỗi sản phẩm không chỉ là một giải pháp chăm sóc da, mà là một tuyên ngôn. Chúng tôi dệt nên những câu chuyện từ{" "}
            <span className="font-semibold text-gray-800 mx-1.5 not-italic">
              Chất Lượng
            </span>{" "}
            thượng hạng, thôi thúc bởi ngọn lửa{" "}
            <span className="font-semibold text-gray-800 mx-1.5 not-italic">
              Đột Phá
            </span>{" "}
            không ngừng, và bước đi với cam kết về sự{" "}
            <span className="font-semibold text-gray-800 mx-1.5 not-italic">
              Bền Vững
            </span>{" "}
            &mdash; để mỗi lựa chọn của bạn không chỉ đẹp, mà còn là một giá trị gửi gắm cho tương lai.
          </p>
          <span className="absolute bottom-0 end-0 text-7xl md:text-8xl text-gray-200 opacity-75 transform translate-x-4 translate-y-6 select-none font-serif leading-none">
            &rdquo;
          </span>
        </div>
      </div>
    </section>
  );
}

export { AboutCoreValues };
