import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ExternalLink, LogOut, Shield } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/features/auth/store/authSlice";

export const AdminHeader: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const getPageTitle = () => {
    const p = location.pathname;
    if (p.includes("/admin/orders")) return "Bán Hàng & Vận Hành > Quản Lý Đơn Hàng";
    if (p.includes("/admin/products")) return "Bán Hàng & Vận Hành > Quản Lý Sản Phẩm";
    if (p.includes("/admin/categories")) return "Bán Hàng & Vận Hành > Danh Mục Sản Phẩm";
    if (p.includes("/admin/warehouse")) return "Kho & Tiếp Liệu > Quản Lý Kho Hàng";
    return "Quản Lý Chung > Bảng Điều Khiển & Doanh Thu";
  };

  const handleLogout = () => {
    localStorage.removeItem("hb_admin_demo_mode");
    dispatch(logout());
  };

  return (
    <header className="h-11 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between text-xs text-slate-700 font-sans shrink-0 sticky top-0 z-20 shadow-2xs">
      <div className="flex items-center gap-2">
        <Shield size={15} className="text-amber-600" />
        <span className="font-bold text-slate-800">{getPageTitle()}</span>
      </div>

      <div className="flex items-center gap-3.5">
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-600 hover:text-rose-600 flex items-center gap-1.5 text-xs hover:underline font-medium"
        >
          <ExternalLink size={13} />
          <span className="hidden sm:inline">Mở Website</span>
        </Link>

        <span className="text-slate-300">|</span>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="px-1.5 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold">
            ADMIN
          </span>
          <span className="hidden sm:inline text-slate-600">
            Xin chào, <strong>{user?.fullName || user?.username || "Quản trị viên"}</strong>
          </span>
        </div>

        <span className="text-slate-300">|</span>

        <button
          onClick={handleLogout}
          className="text-rose-600 hover:underline flex items-center gap-1 text-xs cursor-pointer font-medium"
          title="Đăng xuất"
        >
          <LogOut size={13} />
          <span>Thoát</span>
        </button>
      </div>
    </header>
  );
};
