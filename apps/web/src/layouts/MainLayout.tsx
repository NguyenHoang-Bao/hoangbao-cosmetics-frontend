import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { CartDrawer } from "@/features/cart/components/CartDrawer";
import { CartNotificationToast } from "@/features/cart/components/CartNotificationToast";
import { AiAssistantWidget } from "@/features/chat";

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800 font-sans">
      {/* ── HEADER CHUẨN THƯƠNG HIỆU ── */}
      <Header />

      {/* ── MAIN CONTENT OUTLET (CÓ PADDING BOTTOM CHO MOBILE BOTTOM NAV) ── */}
      <main className="flex-1 w-full pb-16 md:pb-0">
        <Outlet />
      </main>

      {/* ── FOOTER HỒNG 5 CỘT ── */}
      <Footer />

      {/* ── THANH ĐIỀU HƯỚNG CỐ ĐỊNH DƯỚI ĐÁY CHO THIẾT BỊ DI ĐỘNG (MOBILE BOTTOM NAV) ── */}
      <MobileBottomNav />

      {/* ── THÔNG BÁO NỔI KHI THÊM VÀO GIỎ HÀNG ── */}
      <CartNotificationToast />

      {/* ── GLOBAL CART DRAWER (BÊN PHẢI) ── */}
      <CartDrawer />

      {/* ── AI SKINCARE & SHOP ASSISTANT (N8N READY) ── */}
      <AiAssistantWidget />
    </div>
  );
};
