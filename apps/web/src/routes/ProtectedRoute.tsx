import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';

// Chặn khách chưa đăng nhập truy cập các trang nhạy cảm
export default function ProtectedRoute() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // Chuyen ve trang login va nho route hien tai
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
