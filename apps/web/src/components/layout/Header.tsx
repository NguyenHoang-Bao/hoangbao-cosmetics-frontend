import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  User as UserIcon,
  LogOut,
  Package,
} from "lucide-react";
import logo from "@/assets/logo.png";
import { Navbar } from "./Navbar";
import { Button } from "@/components/ui/Button";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/features/auth/store/authSlice";
import { openCart } from "@/features/cart/store/cartSlice";
import { NAVIGATION_ITEMS } from "@/config/navigation";

interface HeaderProps {
  cartItemCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ cartItemCount }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const cartItems = useAppSelector((state) => state.cart.items);
  const totalCartCount =
    cartItemCount !== undefined
      ? cartItemCount
      : cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMobileSearchOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileSubMenu = (label: string) => {
    setExpandedMobileMenu((prev) => (prev === label ? null : label));
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-xs shadow-gray-100">
      {/* ── TẦNG 1: TOP BAR (LOGO, SEARCH, USER ACTIONS) ── */}
      <div className="border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3 md:gap-8">
          
          {/* Cụm Trái (Mobile): Hamburger + Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Nút Hamburger chỉ hiện trên Mobile/Tablet (< 1024px) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 -ml-1 text-neutral-700 hover:text-rose-600 rounded-lg lg:hidden transition-colors cursor-pointer"
              aria-label="Mở menu điều hướng"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo Thương Hiệu Thực Tế */}
            <Link to="/" className="shrink-0 flex items-center">
              <img
                src={logo}
                alt="Hoàng Bảo Cosmetics"
                className="w-26 sm:w-32 md:w-36 h-auto object-contain hover:opacity-95 transition-opacity"
              />
            </Link>
          </div>

          {/* Thanh Tìm Kiếm Desktop (>= 768px) */}
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

          {/* Cụm Phải: Search Mobile, Auth, Wishlist, Giỏ hàng */}
          <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4 shrink-0">
            {/* Nút Tìm kiếm nhanh cho Mobile (< 768px) */}
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen((prev) => !prev)}
              aria-label="Tìm kiếm trên điện thoại"
              className="md:hidden p-1.5 text-neutral-600 hover:text-rose-600 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Đăng nhập | Đăng ký hoặc User Profile trên Desktop */}
            {isAuthenticated && user ? (
              <div className="hidden sm:flex items-center gap-3 text-xs font-medium">
                <Link
                  to="/profile"
                  className="flex items-center gap-1.5 text-neutral-700 hover:text-rose-600 transition-colors"
                >
                  <span className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs uppercase">
                    {user.fullName ? user.fullName.charAt(0) : "U"}
                  </span>
                  <span className="max-w-[120px] truncate font-semibold">
                    {user.fullName || user.username}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => dispatch(logout())}
                  className="text-neutral-400 hover:text-rose-500 transition-colors cursor-pointer text-xs"
                  title="Đăng xuất"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
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
            )}

            {/* Nút Wishlist (Trái tim) */}
            <Link
              to="/products"
              className="text-rose-300 hover:text-rose-500 transition-colors p-1.5"
              title="Danh sách yêu thích"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Nút Giỏ Hàng - Mở CartDrawer */}
            <button
              type="button"
              onClick={() => dispatch(openCart())}
              className="relative text-rose-400 hover:text-rose-600 transition-colors p-1.5 cursor-pointer"
              title="Giỏ hàng"
              aria-label="Mở giỏ hàng"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center shadow-sm">
                  {totalCartCount > 99 ? "99+" : totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── THANH TÌM KIẾM SỔ XUỐNG CHO MOBILE ── */}
        {isMobileSearchOpen && (
          <div className="px-4 py-2 bg-neutral-50 border-t border-neutral-200 md:hidden animate-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm sản phẩm, thương hiệu..."
                className="w-full bg-white border border-neutral-300 rounded-lg py-2 pl-3.5 pr-10 text-sm text-neutral-800 focus:outline-none focus:border-rose-500"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 text-rose-500 hover:text-rose-600 p-1"
                aria-label="Xác nhận tìm kiếm"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ── TẦNG 2: MENU NAVIGATION BAR (DESKTOP) ── */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Navbar />
        </div>
      </div>

      {/* ── 📱 MOBILE NAVIGATION DRAWER (TRƯỢT TỪ BÊN TRÁI SANG) ── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop tối mờ */}
          <div
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Nội dung Drawer */}
          <div className="relative w-4/5 max-w-xs sm:max-w-sm bg-white h-full overflow-y-auto shadow-2xl z-10 flex flex-col animate-in slide-in-from-left duration-300">
            {/* Header của Drawer: Logo & Nút Đóng */}
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
              <img src={logo} alt="Hoàng Bảo Cosmetics" className="w-28 h-auto object-contain" />
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-md text-neutral-400 hover:text-neutral-800 transition-colors"
                aria-label="Đóng menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Khối Thông tin User / Nút Đăng nhập trên Drawer */}
            <div className="p-4 bg-rose-50/50 border-b border-rose-100">
              {isAuthenticated && user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-rose-200 text-rose-700 flex items-center justify-center font-bold text-sm uppercase">
                      {user.fullName ? user.fullName.charAt(0) : "U"}
                    </span>
                    <div className="overflow-hidden">
                      <p className="font-bold text-neutral-900 text-sm truncate">
                        {user.fullName || user.username}
                      </p>
                      <p className="text-xs text-neutral-500 truncate">{user.email || ""}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 py-1.5 bg-white border border-neutral-200 rounded-md text-neutral-700 font-medium hover:text-rose-600"
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      Tài khoản
                    </Link>
                    <Link
                      to="/my-orders"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 py-1.5 bg-white border border-neutral-200 rounded-md text-neutral-700 font-medium hover:text-rose-600"
                    >
                      <Package className="w-3.5 h-3.5" />
                      Đơn hàng
                    </Link>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      dispatch(logout());
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-1 text-xs font-semibold text-rose-600 hover:underline pt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-neutral-600 mb-2">
                    Đăng nhập để nhận ưu đãi thành viên & quản lý đơn hàng
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-center py-2 bg-white border border-rose-300 text-rose-600 rounded-lg text-xs font-bold uppercase tracking-wider"
                    >
                      Đăng Nhập
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-center py-2 bg-rose-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-xs hover:bg-rose-600"
                    >
                      Đăng Ký
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Danh sách các Menu điều hướng */}
            <div className="p-4 space-y-1 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Menu Điều Hướng
              </p>
              {NAVIGATION_ITEMS.map((item) => {
                const isExpanded = expandedMobileMenu === item.label;
                const isActive = location.pathname === item.path;

                // Có menu con
                if (item.subCategories) {
                  return (
                    <div key={item.path} className="border-b border-neutral-100 pb-1">
                      <button
                        type="button"
                        onClick={() => toggleMobileSubMenu(item.label)}
                        className={`w-full flex items-center justify-between py-2.5 px-2 rounded-lg text-sm font-semibold transition-colors ${
                          isActive || isExpanded
                            ? "text-rose-600 bg-rose-50/70"
                            : "text-neutral-800 hover:text-rose-600"
                        }`}
                      >
                        <span>{item.label}</span>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-rose-500" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-neutral-400" />
                        )}
                      </button>

                      {/* Danh mục con dạng Accordion */}
                      {isExpanded && (
                        <div className="pl-4 pr-1 py-1 space-y-1 bg-neutral-50/80 rounded-lg mt-1">
                          <Link
                            to="/products"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block py-1.5 text-xs font-bold text-rose-600 hover:underline"
                          >
                            👉 Xem tất cả sản phẩm
                          </Link>
                          {item.subCategories.map((group) => (
                            <div key={group.label} className="pt-1.5 pb-1 border-t border-neutral-200/50">
                              <Link
                                to={group.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block text-xs font-bold text-neutral-800 hover:text-rose-600"
                              >
                                {group.label}
                              </Link>
                              <div className="pl-2 pt-1 space-y-1">
                                {group.items.map((sub) => (
                                  <Link
                                    key={sub.path}
                                    to={sub.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block text-xs text-neutral-600 hover:text-rose-600 py-0.5"
                                  >
                                    {sub.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                // Link đơn
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block py-2.5 px-2 rounded-lg text-sm font-semibold transition-colors border-b border-neutral-100 ${
                      isActive
                        ? "text-rose-600 bg-rose-50 font-bold"
                        : item.isHighlight
                          ? "text-rose-500 font-bold"
                          : "text-neutral-800 hover:text-rose-600"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Hotline & Chi nhánh dưới đáy Drawer */}
            <div className="p-4 border-t border-neutral-100 bg-neutral-50 text-xs text-neutral-600 space-y-1">
              <p>
                Hotline hỗ trợ: <strong className="text-neutral-900">0359 490 221</strong>
              </p>
              <p>Chi nhánh: 140 Lê Trọng Tấn, Tân Phú, TP.HCM</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
