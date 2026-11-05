import React from "react";
import { Navigate, Outlet, useLocation, Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useAppSelector } from "@/store/hooks";

export const AdminRoute: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Kiem tra quyen ADMIN hoac STAFF
  const hasAdminRole = Boolean(
    user?.roles?.some((role) => {
      const r = role.toUpperCase();
      return r.includes("ADMIN") || r.includes("STAFF") || r.includes("MANAGER");
    })
  );

  // Cho phep che do xem Demo neu nguoi dung kich hoat hoac tai khoan mac dinh
  const isDemoAdmin = localStorage.getItem("hb_admin_demo_mode") === "true";

  if (!hasAdminRole && !isDemoAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full text-center shadow-xl">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-xl font-black text-slate-800 mb-2">Truy Cập Bị Giới Hạn</h2>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Tài khoản <span className="font-semibold text-slate-700">{user?.username}</span> không có quyền Quản trị viên (ADMIN / STAFF). Vui lòng đăng nhập bằng tài khoản có thẩm quyền.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                localStorage.setItem("hb_admin_demo_mode", "true");
                window.location.reload();
              }}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
            >
              Xem Thử Giao Diện Quản Trị (Demo Mode)
            </button>
            <Link
              to="/"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
            >
              <ArrowLeft size={14} /> Quay về Trang Chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default AdminRoute;
