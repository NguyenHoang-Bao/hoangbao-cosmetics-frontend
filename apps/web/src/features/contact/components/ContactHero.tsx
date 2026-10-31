const heroBgImg =
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=2070&q=80&auto=format&fit=crop";

export default function ContactHero() {
  return (
    <section className="relative flex items-center justify-center text-center w-full min-h-[250px] h-[35vh] overflow-hidden">
      {/* Anh nen my pham */}
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${heroBgImg})` }}
      />
      {/* Lop phu toi sang trong */}
      <div className="absolute inset-0 bg-black/60 z-1" />

      {/* Noi dung chu */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-5xl font-extrabold uppercase mb-3 text-white tracking-[2px]">
          Liên Hệ Với Chúng Tôi
        </h1>
        <p className="text-base md:text-xl text-rose-100 tracking-[1px] opacity-95 font-light">
          Hoàng Bảo Cosmetics luôn sẵn sàng lắng nghe và đồng hành cùng làn da của bạn
        </p>
      </div>
    </section>
  );
}

export { ContactHero };
