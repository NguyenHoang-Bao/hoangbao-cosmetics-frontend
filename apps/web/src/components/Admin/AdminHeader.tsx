import { ExternalLink, LogOut, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminHeaderProps {
  activeTab: string;
  currentUser: { name: string; role: string; [key: string]: any } | null;
  productCount?: number;
  onLogout?: () => void;
}

export default function AdminHeader({
  activeTab,
  currentUser,
  onLogout
}: AdminHeaderProps) {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Quản Lý Chung & Báo Cáo Doanh Thu';
      case 'ai_reports':
        return 'Vận Hành > Giám Sát AI & Xử Lý Sự Cố Khách Hàng';
      case 'orders':
        return 'Bán Hàng & Kho > Giám Sát Dòng Đơn & Đối Soát COD';
      case 'products':
        return 'Bán Hàng & Kho > Quản Lý Sản Phẩm & Bảng Giá';
      case 'categories':
        return 'Bán Hàng & Kho > Quản Lý Danh Mục';
      case 'coupons':
        return 'Bán Hàng & Kho > Quản Lý Mã Giảm Giá & Voucher';
      case 'inventory':
        return 'Bán Hàng & Kho > Quản Lý Kho & Duyệt Nhập Xuất';
      case 'interface_menu':
        return 'Giao diện > Menu Website';
      case 'interface_layout':
        return 'Giao diện > Bố Cục Trang Chủ';
      case 'interface_theme':
        return 'Giao diện > Tùy Chỉnh Màu Sắc';
      case 'content_pages':
        return 'Nội dung Website > Trang Giới Thiệu & Chính Sách';
      case 'content_articles':
        return 'Nội dung Website > Quản Lý Bài Viết Cẩm Nang';
      case 'users':
        return 'Hệ Thống > Tài khoản & Phân quyền các bên';
      default:
        return 'Bảng Quản Trị Hệ Thống';
    }
  };

  return (
    <header className="h-10 bg-white border-b border-[#ccc] px-3 flex items-center justify-between text-xs text-[#333] font-sans">
      {/* Breadcrumb kiểu cổ điển */}
      <div className="flex items-center gap-1.5 text-xs text-[#555]">
        <Shield size={14} className="text-[#3c8dbc]" />
        <span className="font-bold text-[#333]">{getTabTitle()}</span>
      </div>

      {/* Thông tin Quản Trị Viên */}
      <div className="flex items-center gap-3">
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#666] hover:text-[#333] flex items-center gap-1 text-[11px] hover:underline"
        >
          <ExternalLink size={12} />
          <span>Xem Website</span>
        </Link>

        <span className="text-[#ccc]">|</span>

        <div className="text-[#555] text-xs flex items-center gap-1.5">
          <span className="inline-block px-1.5 py-0.5 bg-[#d9534f] text-white rounded text-[10px] font-bold">
            ADMIN
          </span>
          <span>
            Xin chào, <strong>{currentUser?.name || 'Quản trị viên'}</strong>
          </span>
        </div>

        {onLogout && (
          <>
            <span className="text-[#ccc]">|</span>
            <button
              onClick={onLogout}
              className="text-[#dd4b39] hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
              title="Đăng xuất"
            >
              <LogOut size={12} />
              <span>Thoát</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
}
