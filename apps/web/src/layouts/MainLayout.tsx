import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/features/cart/components/CartDrawer";

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800 font-sans">
      {/* ── HEADER CHUẨN THƯƠNG HIỆU ── */}
      <Header />

      {/* ── MAIN CONTENT OUTLET ── */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* ── FOOTER HỒNG 5 CỘT ── */}
      <Footer />

      {/* ── GLOBAL CART DRAWER ── */}
      <CartDrawer />
    </div>
  );
};
