import React, { useEffect } from "react";
import { AboutHero } from "../components/AboutHero";
import { AboutStory } from "../components/AboutStory";
import { AboutCoreValues } from "../components/AboutCoreValues";

export const AboutPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="bg-white text-neutral-900 min-h-screen">
      {/* ── HERO BANNER VỀ CHÚNG TÔI ── */}
      <AboutHero />

      {/* ── CÂU CHUYỆN THƯƠNG HIỆU & VIDEO CLIP ── */}
      <AboutStory />

      {/* ── GIÁ TRỊ CỐT LÕI & CỘT MỐC ĐẠT ĐƯỢC ── */}
      <AboutCoreValues />
    </div>
  );
};

export default AboutPage;
