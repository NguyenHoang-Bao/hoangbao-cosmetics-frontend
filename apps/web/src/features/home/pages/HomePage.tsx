import React from "react";
import { HeroCarousel } from "../components/HeroCarousel";
import { FlashSale } from "../components/FlashSale";
import { FeaturedCategoriesAndBrand } from "../components/FeaturedCategoriesAndBrand";
import { BeautyPhilosophy } from "../components/BeautyPhilosophy";
import { NewArrivals } from "../components/NewArrivals";
import { ShopBySkinType } from "../components/ShopBySkinType";
import { StoryVideoBanner } from "../components/StoryVideoBanner";
import { Services } from "../components/Services";
import { FAQ } from "../components/FAQ";

export const HomePage: React.FC = () => {
  return (
    <main className="bg-neutral-50/50 min-h-screen">
      {/* 1. Hero Banner Carousel */}
      <HeroCarousel />

      {/* 2. Flash Sale với đồng hồ đếm ngược */}
      <FlashSale />

      {/* 3. Danh mục nổi bật & Thương hiệu uy tín */}
      <FeaturedCategoriesAndBrand />

      {/* 4. Triết lý làm đẹp: Thành phần thiên nhiên & Chuẩn y khoa */}
      <BeautyPhilosophy />

      {/* 5. Sản phẩm mới về */}
      <NewArrivals limit={8} />

      {/* 6. Giải pháp theo từng loại da */}
      <ShopBySkinType />

      {/* 7. Video Banner & Cam kết chất lượng thương hiệu */}
      <StoryVideoBanner />

      {/* 8. Trải nghiệm & Dịch vụ khách hàng chu đáo */}
      <Services />

      {/* 9. Câu hỏi thường gặp */}
      <FAQ />
    </main>
  );
};

export default HomePage;
