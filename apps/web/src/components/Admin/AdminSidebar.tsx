import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  Tag,
  ShoppingCart,
  Users,
  ExternalLink,
  LogOut,
  ChevronRight,
  Minus,
  Plus,
  ShieldCheck,
  Package,
  Bot,
  Boxes
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: { name: string; role: string; [key: string]: any } | null;
  handleLogout: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  currentUser,
  handleLogout,
  isCollapsed,
  setIsCollapsed
}: AdminSidebarProps) {
  const [openSections, setOpenSections] = useState({
    storeManagement: true,
    system: true
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <aside
      className={`h-screen bg-[#222d32] text-[#b8c7ce] flex flex-col justify-between border-r border-[#1a2226] select-none text-xs font-sans transition-[width] duration-200 ${
        isCollapsed ? 'w-12' : 'w-56'
      }`}
    >
      <div>
        {/* Header Logo */}
        <div className="h-11 flex items-center justify-between px-3 bg-[#1a2226] border-b border-[#151c20]">
          {!isCollapsed ? (
            <div className="flex items-center justify-between w-full">
              <Link to="/admin" className="text-white font-bold text-sm tracking-tight flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-[#f39c12]" />
                <span>HoangBao<span className="text-[#f39c12]">.admin</span></span>
              </Link>
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#b8c7ce] hover:text-white p-1"
                title="Xem Website"
              >
                <ExternalLink size={13} />
              </Link>
            </div>
          ) : (
            <div className="w-full text-center font-bold text-white text-xs">AD</div>
          )}
        </div>

        {/* Thông tin tài khoản Admin */}
        <div className="px-3 py-2 bg-[#1e282c] border-b border-[#1a2226]">
          {!isCollapsed ? (
            <div className="flex items-center justify-between">
              <div className="w-full">
                <p className="text-white font-semibold truncate max-w-[170px]">{currentUser?.name || 'Admin'}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span className="text-[11px] text-[#8aa4af]">Quản Trị Viên (Chủ Shop)</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-[#8aa4af] text-[10px]">AD</div>
          )}
        </div>

        {/* Menu Quản Trị Hệ Thống */}
        <nav className="p-1 space-y-0.5 max-h-[calc(100vh-170px)] overflow-y-auto">
          {/* 1. Quản lý chung / Báo cáo */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-2 px-2.5 py-2 text-left cursor-pointer transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-[#1e282c] text-white font-bold border-l-2 border-[#3c8dbc]'
                : 'text-[#b8c7ce] hover:bg-[#1e282c] hover:text-white'
            }`}
            title="Quản Lý Chung & Doanh Thu"
          >
            <Home size={14} className="shrink-0 text-[#b8c7ce]" />
            {!isCollapsed && <span>Báo Cáo & Doanh Thu</span>}
          </button>

          {/* 2. GIÁM SÁT AI & SỰ CỐ (Tính năng cốt lõi cho mô hình tự động) */}
          <button
            onClick={() => setActiveTab('ai_reports')}
            className={`w-full flex items-center justify-between px-2.5 py-2 text-left cursor-pointer transition-colors ${
              activeTab === 'ai_reports'
                ? 'bg-[#291b38] text-purple-300 font-bold border-l-2 border-purple-500'
                : 'text-[#b8c7ce] hover:bg-[#1e282c] hover:text-white'
            }`}
            title="Giám sát AI & Khiếu nại từ khách hàng"
          >
            <div className="flex items-center gap-2">
              <Bot size={14} className="shrink-0 text-purple-400" />
              {!isCollapsed && <span>Giám Sát AI & Sự Cố</span>}
            </div>
            {!isCollapsed && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-black font-bold text-[10px] rounded-full">
                2 ca
              </span>
            )}
          </button>

          {/* 3. Nhóm QUẢN LÝ BÁN HÀNG & KHO */}
          <div className="pt-2">
            <div
              onClick={() => toggleSection('storeManagement')}
              className={`flex items-center justify-between px-2.5 py-1 text-[11px] font-bold text-[#4b646f] uppercase tracking-wider cursor-pointer hover:text-white ${
                isCollapsed ? 'hidden' : 'flex'
              }`}
            >
              <span>BÁN HÀNG & KHO</span>
              <span>{openSections.storeManagement ? <Minus size={9} /> : <Plus size={9} />}</span>
            </div>

            {openSections.storeManagement && (
              <div className="space-y-0.5">
                {/* Quản lý đơn hàng */}
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-left cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-[#1e282c] text-white font-bold border-l-2 border-[#3c8dbc]'
                      : 'text-[#b8c7ce] hover:bg-[#1e282c] hover:text-white'
                  }`}
                  title="Giám Sát Dòng Đơn & Đối Soát COD"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingCart size={13} className="shrink-0" />
                    {!isCollapsed && <span>Giám Sát & Đối Soát Đơn</span>}
                  </div>
                  {!isCollapsed && <ChevronRight size={11} className="text-[#666]" />}
                </button>

                {/* Quản lý sản phẩm & giá vốn */}
                <button
                  onClick={() => setActiveTab('products')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-left cursor-pointer ${
                    activeTab === 'products'
                      ? 'bg-[#1e282c] text-white font-bold border-l-2 border-[#3c8dbc]'
                      : 'text-[#b8c7ce] hover:bg-[#1e282c] hover:text-white'
                  }`}
                  title="Quản Lý Sản Phẩm & Giá"
                >
                  <div className="flex items-center gap-2">
                    <Package size={13} className="shrink-0" />
                    {!isCollapsed && <span>Sản Phẩm & Bảng Giá</span>}
                  </div>
                  {!isCollapsed && <ChevronRight size={11} className="text-[#666]" />}
                </button>

                {/* Quản lý danh mục */}
                <button
                  onClick={() => setActiveTab('categories')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-left cursor-pointer ${
                    activeTab === 'categories'
                      ? 'bg-[#1e282c] text-white font-bold border-l-2 border-[#3c8dbc]'
                      : 'text-[#b8c7ce] hover:bg-[#1e282c] hover:text-white'
                  }`}
                  title="Quản Lý Danh Mục"
                >
                  <div className="flex items-center gap-2">
                    <Tag size={13} className="shrink-0" />
                    {!isCollapsed && <span>Quản Lý Danh Mục</span>}
                  </div>
                  {!isCollapsed && <ChevronRight size={11} className="text-[#666]" />}
                </button>

                {/* Quản lý kho & Duyệt nhập xuất */}
                <button
                  onClick={() => setActiveTab('inventory')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-left cursor-pointer ${
                    activeTab === 'inventory'
                      ? 'bg-[#1e282c] text-white font-bold border-l-2 border-[#3c8dbc]'
                      : 'text-[#b8c7ce] hover:bg-[#1e282c] hover:text-white'
                  }`}
                  title="Kho & Duyệt Nhập Xuất"
                >
                  <div className="flex items-center gap-2">
                    <Boxes size={13} className="shrink-0" />
                    {!isCollapsed && <span>Kho & Nhập Xuất</span>}
                  </div>
                  {!isCollapsed && <ChevronRight size={11} className="text-[#666]" />}
                </button>
              </div>
            )}
          </div>

          {/* 4. Nhóm HỆ THỐNG */}
          <div className="pt-2">
            <div
              className={`px-2.5 py-1 text-[11px] font-bold text-[#4b646f] uppercase tracking-wider ${
                isCollapsed ? 'hidden' : 'block'
              }`}
            >
              HỆ THỐNG
            </div>
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-left cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-[#1e282c] text-white font-bold border-l-2 border-[#3c8dbc]'
                  : 'text-[#b8c7ce] hover:bg-[#1e282c] hover:text-white'
              }`}
              title="Tài khoản & Phân quyền các bên"
            >
              <Users size={13} className="shrink-0" />
              {!isCollapsed && <span>Tài Khoản & Phân Quyền</span>}
            </button>
          </div>
        </nav>
      </div>

      {/* Footer đăng xuất */}
      <div className="p-2 bg-[#1a2226] border-t border-[#151c20] flex items-center justify-between text-xs">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-[#b8c7ce] hover:text-white cursor-pointer px-1 py-0.5 rounded hover:bg-[#222d32]"
          title={isCollapsed ? 'Mở rộng' : 'Thu nhỏ'}
        >
          {isCollapsed ? '>>' : '<< Thu nhỏ'}
        </button>
        <button
          onClick={handleLogout}
          className="text-[#dd4b39] hover:underline cursor-pointer flex items-center gap-1"
        >
          <LogOut size={12} />
          {!isCollapsed && <span>Thoát</span>}
        </button>
      </div>
    </aside>
  );
}
