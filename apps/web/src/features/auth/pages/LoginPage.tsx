import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import { X, Loader2 } from 'lucide-react';
import AuthBanner from '../components/AuthBanner';
import { loginSchema, type LoginFormData } from '../schemas/authSchema';
import { authService } from '../api/authService';
import { useAppDispatch } from '@/store/hooks';
import { loginStart, setCredentials, loginFailure } from '../store/authSlice';

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      dispatch(loginStart());

      // Goi API login sang Backend AWS EC2
      const authData = await authService.login({
        username: data.username,
        password: data.password,
      });

      // Luu Redux store va localStorage
      dispatch(
        setCredentials({
          user: {
            idUser: authData.idUser,
            username: authData.username,
            fullName: authData.fullName,
            email: authData.email,
            avatar: authData.avatar,
            roles: authData.roles,
          },
          token: authData.accessToken,
        })
      );

      navigate('/');
    } catch (err: any) {
      const msg = err.message || 'Đăng nhập thất bại. Vui lòng thử lại!';
      setError(msg);
      dispatch(loginFailure(msg));
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Nửa Trái: Banner 1 hình ảnh gốc (biaLogin.jpg) */}
      <AuthBanner />

      {/* Nửa Phải: Form Đăng Nhập */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative py-10 px-6 sm:px-10 min-h-screen overflow-y-auto">
        {/* Nút X thoát về trang chủ */}
        <Link
          to="/"
          className="absolute top-6 right-6 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
        >
          <X size={28} />
        </Link>

        <div className="w-full max-w-md my-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 uppercase mb-6">
            Đăng Nhập
          </h2>

          {(error || errors.username || errors.password) && (
            <div className="text-red-500 mb-4 text-sm font-medium">
              {error || errors.username?.message || errors.password?.message}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Input Số điện thoại / Email - Floating Label gạch chân chuẩn gốc */}
            <div className="relative">
              <input
                type="text"
                id="login-username"
                className="peer w-full bg-transparent border-0 border-b border-gray-300 text-gray-900 focus:outline-none focus:border-rose-500 focus:ring-0 placeholder-transparent py-2 transition-colors"
                placeholder="Số điện thoại / Email"
                {...register('username')}
              />
              <label
                htmlFor="login-username"
                className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-rose-600 cursor-text"
              >
                Số điện thoại / Email
              </label>
            </div>

            {/* Input Mật khẩu - Floating Label */}
            <div className="relative">
              <input
                type="password"
                id="login-password"
                className="peer w-full bg-transparent border-0 border-b border-gray-300 text-gray-900 focus:outline-none focus:border-rose-500 focus:ring-0 placeholder-transparent py-2 transition-colors"
                placeholder="Mật khẩu"
                {...register('password')}
              />
              <label
                htmlFor="login-password"
                className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-rose-600 cursor-text"
              >
                Mật khẩu
              </label>
            </div>

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-gray-500 hover:text-rose-600 transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Nút submit uppercase đậm chuẩn thiết kế */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-bold py-3 uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="animate-spin" size={20} />}
              {isSubmitting ? 'Đang xử lý...' : 'Đăng Nhập'}
            </button>

            <div className="text-center mt-6 text-sm text-gray-500">
              Chưa có tài khoản?{' '}
              <Link
                to="/register"
                className="text-rose-500 font-semibold hover:text-rose-700 transition-colors ml-1"
              >
                Đăng ký ngay
              </Link>
            </div>

            {/* Đường phân cách HOẶC */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-400 font-medium">Hoặc</span>
              </div>
            </div>

            {/* 2 Nút Đăng nhập Google & Facebook */}
            <div className="w-full space-y-3">
              <button
                type="button"
                className="w-full h-[42px] px-4 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded border border-gray-300 text-sm flex items-center justify-center gap-2.5 transition-colors cursor-pointer shadow-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Đăng nhập bằng Google</span>
              </button>

              <button
                type="button"
                className="w-full h-[42px] px-4 bg-[#1877F2] hover:bg-[#166fe5] text-white font-medium rounded text-sm flex items-center justify-center gap-2.5 transition-colors cursor-pointer shadow-xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Tiếp tục với Facebook</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
