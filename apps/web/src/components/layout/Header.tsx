import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Heart, ShoppingBag } from "lucide-react";
import logo from "@/assets/logo.png";
import { Navbar } from "./Navbar";
import { Button } from "@/components/ui/Button";

interface HeaderProps {
  cartItemCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ cartItemCount = 0 }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-xs shadow-gray-100">
      {/* ── TẦNG 1: TOP BAR (LOGO, SEARCH, USER ACTIONS) ── */}
      <div className="border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4 md:gap-8">
          {/* Logo Thương Hiệu Thực Tế */}
          <Link to="/" className="shrink-0 flex items-center">
            <img
              src={logo}
              alt="Hoàng Bảo Cosmetics"
              className="w-28 md:w-36 h-auto object-contain hover:opacity-95 transition-opacity"
            />
          </Link>

          {/* Thanh Tìm Kiếm Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm sản phẩm, danh mục..."
              className="w-full border border-gray-300 bg-white rounded-md py-2 pl-4 pr-11 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-rose-500 transition-all shadow-xs"
            />
            <button
              type="submit"
              aria-label="Tìm kiếm"
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-rose-500 hover:bg-rose-600 text-white rounded-md w-8 h-8 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Cụm Action Buttons: Auth, Wishlist, Giỏ hàng */}
          <div className="flex items-center gap-3 md:gap-4 shrink-0">
            {/* Đăng nhập | Đăng ký */}
            <div className="hidden sm:flex items-center gap-2 text-xs xl:text-sm font-semibold">
              <Link
                to="/login"
                className="text-gray-700 hover:text-rose-600 transition-colors px-1"
              >
                ĐĂNG NHẬP
              </Link>
              <span className="text-gray-300">|</span>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  ĐĂNG KÝ
                </Button>
              </Link>
            </div>

            {/* Nút Wishlist (Trái tim) */}
            <Link
              to="/products"
              className="text-rose-300 hover:text-rose-500 transition-colors p-1.5"
              title="Danh sách yêu thích"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Nút Giỏ Hàng */}
            <Link
              to="/cart"
              className="relative text-rose-400 hover:text-rose-600 transition-colors p-1.5"
              title="Giỏ hàng"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-400 text-white text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center shadow-sm">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* ── TẦNG 2: MENU NAVIGATION BAR ── */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Navbar />
        </div>
      </div>
    </header>
  );
};
