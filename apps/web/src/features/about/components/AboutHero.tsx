import aboutHeroImg from "@/assets/img/about-hero.jpg";

export default function AboutHero() {
  return (
    <section className="relative flex items-center justify-center text-center w-full min-h-[300px] h-[40vh] overflow-hidden bg-black">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${aboutHeroImg})` }}
      />
      {/* Dark Overlay 60% */}
      <div className="absolute inset-0 bg-black/60 z-1" />
      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase mb-4 text-white tracking-[2px]">
          Về Chúng Tôi
        </h1>
        <p className="text-lg md:text-xl text-gray-200 tracking-[1px] opacity-90 font-light">
          Định hình vẻ đẹp thuần khiết nguyên bản &mdash; Chăm sóc da chuẩn y khoa
        </p>
      </div>
    </section>
  );
}

export { AboutHero };
