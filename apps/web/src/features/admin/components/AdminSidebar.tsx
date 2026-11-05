import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FolderTree,
  Warehouse,
  ExternalLink,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/features/auth/store/authSlice";

interface AdminSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
}) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const menuItems = [
    {
      label: "Tổng Quan & Doanh Thu",
      path: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Quản Lý Đơn Hàng",
      path: "/admin/orders",
      icon: ShoppingCart,
      badge: "LIVE",
    },
    {
      label: "Quản Lý Sản Phẩm",
      path: "/admin/products",
      icon: Package,
    },
    {
      label: "Danh Mục Sản Phẩm",
      path: "/admin/categories",
      icon: FolderTree,
    },
    {
      label: "Quản Lý Kho Hàng",
      path: "/admin/warehouse",
      icon: Warehouse,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("hb_admin_demo_mode");
    dispatch(logout());
  };

  const isCurrentActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={`h-screen bg-[#222d32] text-[#b8c7ce] flex flex-col justify-between border-r border-[#1a2226] select-none text-xs font-sans transition-all duration-200 z-30 shrink-0 ${
        isCollapsed ? "w-14" : "w-60"
      }`}
    >
      <div>
        {/* Header Logo */}
        <div className="h-12 flex items-center justify-between px-3 bg-[#1a2226] border-b border-[#151c20]">
          {!isCollapsed ? (
            <div className="flex items-center justify-between w-full">
              <Link
                to="/admin"
                className="text-white font-bold text-sm tracking-tight flex items-center gap-1.5"
              >
                <ShieldCheck size={18} className="text-[#f39c12]" />
                <span>
                  HoangBao<span className="text-[#f39c12]">.admin</span>
                </span>
              </Link>
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#b8c7ce] hover:text-white p-1 rounded transition-colors"
                title="Mở Website bán hàng"
              >
                <ExternalLink size={14} />
              </Link>
            </div>
          ) : (
            <div className="w-full text-center font-black text-amber-500 text-xs">HB</div>
          )}
        </div>

        {/* Thông tin tài khoản Admin */}
        <div className="px-3 py-3 bg-[#1e282c] border-b border-[#1a2226]">
          {!isCollapsed ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                {user?.fullName?.charAt(0) || user?.username?.charAt(0) || "A"}
              </div>
              <div className="min-w-0">
                <p className="text-white font-semibold truncate text-xs">
                  {user?.fullName || user?.username || "Quản trị viên"}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-[11px] text-[#8aa4af]">Quản Trị Viên</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-[10px] mx-auto">
              {user?.username?.charAt(0) || "A"}
            </div>
          )}
        </div>

        {/* Danh sách Menu Navigation */}
        <nav className="py-2 px-1.5 space-y-1">
          {!isCollapsed && (
            <p className="px-3 py-1.5 text-[10px] font-bold text-[#4b646f] uppercase tracking-wider">
              Bán Hàng & Vận Hành
            </p>
          )}

          {menuItems.map((item) => {
            const active = isCurrentActive(item.path, item.exact);
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  active
                    ? "bg-[#1e282c] text-white border-l-4 border-amber-500 font-semibold shadow-xs"
                    : "text-[#b8c7ce] hover:bg-[#1a2226] hover:text-white"
                } ${isCollapsed ? "justify-center px-0" : ""}`}
              >
                <Icon size={16} className={active ? "text-amber-500 shrink-0" : "shrink-0"} />
                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between truncate">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold bg-rose-500 text-white rounded">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Sidebar (Collapse + Logout) */}
      <div className="p-2 border-t border-[#1a2226] bg-[#1e282c]">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center gap-2 py-2 text-[#8aa4af] hover:text-white hover:bg-[#1a2226] rounded-md transition-colors text-xs cursor-pointer mb-1"
          title={isCollapsed ? "Mở rộng menu" : "Thu gọn menu"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : (
            <>
              <ChevronLeft size={16} />
              <span>Thu gọn menu</span>
            </>
          )}
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-md transition-colors text-xs cursor-pointer"
          title="Đăng xuất"
        >
          <LogOut size={14} />
          {!isCollapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
};
