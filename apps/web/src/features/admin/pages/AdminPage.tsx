import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AdminSidebar from '@/components/Admin/AdminSidebar';
import AdminHeader from '@/components/Admin/AdminHeader';
import ProductManagement from '@/components/Admin/Products/ProductManagement';
import CategoryManagement from '@/components/Admin/Categories/CategoryManagement';
import OrderManagement from '@/components/Admin/Orders/OrderManagement';
import DashboardOverview from '@/components/Admin/Dashboard/DashboardOverview';
import UserManagement from '@/components/Admin/Users/UserManagement';
import AIReportsManagement from '@/components/Admin/AIReports/AIReportsManagement';
import InventoryManagement from '@/components/Admin/Inventory/InventoryManagement';
import { adminService, type ProductItem, type CategoryItem } from '@/services/adminService';
import { Shield, ShieldAlert, LogOut } from 'lucide-react';

interface User {
  name: string;
  role: string;
  email?: string;
  [key: string]: any;
}

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentTabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<string>(currentTabParam || 'dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const loadData = () => {
    const prods = adminService.getProducts();
    const cats = adminService.getCategories();
    setProducts(prods);
    setCategories(cats);
  };

  useEffect(() => {
    loadData();

    try {
      const stored = localStorage.getItem('currentUser') || localStorage.getItem('hb_user');
      if (stored) {
        const u = JSON.parse(stored);
        setCurrentUser({
          name: u.fullName || u.name || u.username || 'Nguyễn Hoàng Bảo',
          role: u.roles?.some((r: string) => r.includes('ADMIN')) ? 'ADMIN' : (u.role || 'ADMIN'),
          email: u.email || 'admin@hoangbao.vn'
        });
      } else {
        // Mặc định tài khoản Quản trị viên mẫu
        const defaultAdmin: User = {
          name: 'Nguyễn Hoàng Bảo',
          role: 'ADMIN',
          email: 'admin@hoangbao.vn'
        };
        setCurrentUser(defaultAdmin);
        localStorage.setItem('currentUser', JSON.stringify(defaultAdmin));
      }
    } catch {
      setCurrentUser(null);
    } finally {
      setAuthChecked(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('hb_token');
    setCurrentUser(null);
    navigate('/login');
  };

  const handleAdminDemoLogin = () => {
    const defaultAdmin: User = {
      name: 'Nguyễn Hoàng Bảo (Admin)',
      role: 'ADMIN',
      email: 'admin@hoangbao.vn'
    };
    setCurrentUser(defaultAdmin);
    localStorage.setItem('currentUser', JSON.stringify(defaultAdmin));
    setActiveTab('dashboard');
    setSearchParams({ tab: 'dashboard' });
  };

  if (!authChecked) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#222d32] text-[#ccc] text-xs">
        Đang tải hệ thống quản trị Admin...
      </div>
    );
  }

  // 1. Trường hợp chưa đăng nhập
  if (!currentUser) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#ecf0f5] p-4 text-xs font-sans text-[#333]">
        <div className="bg-white border border-[#ccc] p-6 max-w-sm w-full space-y-4 shadow-md">
          <div className="flex items-center gap-2 border-b border-[#eee] pb-3 text-red-700">
            <Shield size={20} />
            <h2 className="text-sm font-bold uppercase">Cổng Quản Trị Cấp Cao (Admin)</h2>
          </div>
          <p className="text-[#666] leading-relaxed">
            Khu vực này chỉ dành riêng cho Quản trị viên hệ thống. Vui lòng đăng nhập với tài khoản Admin.
          </p>
          <div className="space-y-2 pt-2">
            <button
              onClick={handleAdminDemoLogin}
              className="w-full py-2 bg-[#222d32] hover:bg-[#111] text-white font-medium cursor-pointer"
            >
              Đăng nhập Quản Trị Viên (Demo)
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-1.5 border border-[#ccc] hover:bg-[#f9f9f9] text-[#555] cursor-pointer"
            >
              Trang đăng nhập hệ thống
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Trường hợp không phải Admin
  if (currentUser.role !== 'ADMIN') {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#ecf0f5] p-4 text-xs font-sans text-[#333]">
        <div className="bg-white border border-[#ccc] p-6 max-w-sm w-full space-y-4 shadow-md">
          <div className="flex items-center gap-2 text-red-600 border-b border-[#eee] pb-2">
            <ShieldAlert size={20} />
            <h2 className="text-sm font-bold uppercase">Không có quyền truy cập</h2>
          </div>
          <p className="text-[#666]">
            Tài khoản hiện tại ({currentUser.name}) không có quyền truy cập Cổng Quản Trị Cấp Cao (Admin).
          </p>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => navigate('/')}
              className="flex-1 py-1.5 bg-[#333] hover:bg-[#111] text-white font-medium cursor-pointer"
            >
              Về Trang Chủ
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 border border-[#ccc] hover:bg-[#f5f5f5] text-[#666] flex items-center gap-1 cursor-pointer"
            >
              <LogOut size={13} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#ecf0f5] font-sans text-xs select-none">
      {/* 1. Sidebar Quản Trị Viên */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        currentUser={currentUser}
        handleLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* 2. Khung nội dung Quản Trị */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header Admin */}
        <AdminHeader
          activeTab={activeTab}
          currentUser={currentUser}
          productCount={products.length}
          onLogout={handleLogout}
        />

        {/* Nội dung trang */}
        <main className="flex-1 overflow-y-auto p-3 bg-[#ecf0f5]">
          <div className="max-w-7xl mx-auto">
            {/* 1. Dashboard tổng quan doanh thu & kênh bán */}
            {activeTab === 'dashboard' && (
              <DashboardOverview
                products={products}
                categories={categories}
                onNavigateTab={handleTabChange}
              />
            )}

            {/* 2. Giám sát AI Agent & Xử lý khiếu nại (Trung tâm sự cố) */}
            {activeTab === 'ai_reports' && <AIReportsManagement />}

            {/* 3. Bán hàng & Giám sát dòng đơn & Đối soát COD (AI/Web/POS tự duyệt) */}
            {activeTab === 'orders' && <OrderManagement />}

            {/* 4. Quản lý sản phẩm & giá */}
            {activeTab === 'products' && (
              <ProductManagement
                products={products}
                categories={categories}
                onRefresh={loadData}
              />
            )}

            {/* 5. Quản lý danh mục */}
            {activeTab === 'categories' && (
              <CategoryManagement
                categories={categories}
                products={products}
                onRefresh={loadData}
              />
            )}

            {/* 6. Quản lý kho, duyệt nhập hàng & cảnh báo date */}
            {activeTab === 'inventory' && <InventoryManagement />}

            {/* 7. Tài khoản & Phân quyền các bên */}
            {activeTab === 'users' && <UserManagement />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
