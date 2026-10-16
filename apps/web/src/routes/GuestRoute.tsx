import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';

// Chặn người dùng đã đăng nhập không cho vào lại trang login/register
export default function GuestRoute() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
