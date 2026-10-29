import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import { X, Loader2 } from 'lucide-react';
import AuthBanner from '../components/AuthBanner';
import { registerSchema, type RegisterFormData } from '../schemas/authSchema';
import { authService } from '../api/authService';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError('');
      await authService.register({
        fullName: data.fullName,
        username: data.username,
        phoneNumber: data.phoneNumber,
        email: data.email,
        password: data.password,
      });

      alert('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin!');
    }
  };

  const fields = [
    { key: 'fullName' as const, label: 'Họ và tên', type: 'text' },
    { key: 'username' as const, label: 'Tên tài khoản', type: 'text' },
    { key: 'email' as const, label: 'Email', type: 'email' },
    { key: 'phoneNumber' as const, label: 'Số điện thoại', type: 'tel' },
    { key: 'password' as const, label: 'Mật khẩu', type: 'password' },
    { key: 'confirmPassword' as const, label: 'Xác nhận mật khẩu', type: 'password' },
  ];

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Nửa Trái: Banner ảnh mỹ phẩm gốc */}
      <AuthBanner />

      {/* Nửa Phải: Form Đăng Ký Grid 2 Cột */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative py-10 px-6 sm:px-10 min-h-screen overflow-y-auto">
        <Link
          to="/"
          className="absolute top-6 right-6 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
        >
          <X size={28} />
        </Link>

        <div className="w-full max-w-lg my-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 uppercase mb-4 sm:mb-6">
            Đăng Ký
          </h2>

          {error && <div className="text-red-500 mb-3 text-xs sm:text-sm font-medium">{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              {fields.map(({ key, label, type }) => (
                <div className="relative" key={key}>
                  <input
                    type={type}
                    id={`register-${key}`}
                    className="peer w-full bg-transparent border-0 border-b border-gray-300 text-gray-900 focus:outline-none focus:border-rose-500 focus:ring-0 placeholder-transparent py-1.5 text-sm transition-colors"
                    placeholder={label}
                    {...register(key)}
                  />
                  <label
                    htmlFor={`register-${key}`}
                    className="absolute left-0 -top-3.5 text-gray-500 text-xs transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-1.5 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-rose-600 cursor-text"
                  >
                    {label}
                  </label>
                  {errors[key] && (
                    <p className="text-[10px] text-red-500 mt-0.5">{errors[key]?.message}</p>
                  )}
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-bold py-2.5 uppercase tracking-wider transition-colors mt-6 flex justify-center items-center gap-2 cursor-pointer text-sm"
            >
              {isSubmitting && <Loader2 className="animate-spin" size={18} />}
              {isSubmitting ? 'Đang xử lý...' : 'Đăng Ký'}
            </button>

            <div className="text-center mt-3 text-xs sm:text-sm text-gray-500">
              Đã có tài khoản?{' '}
              <Link
                to="/login"
                className="text-rose-500 font-semibold hover:text-rose-700 transition-colors ml-1"
              >
                Đăng nhập
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
