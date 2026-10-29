import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { X, Loader2, ArrowLeft } from "lucide-react";
import AuthBanner from "../components/AuthBanner";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../schemas/authSchema";
import { authService } from "../api/authService";

interface StatusState {
  type: "error" | "success" | "";
  message: string;
}

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<StatusState>({ type: "", message: "" });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setStatus({ type: "", message: "" });
      const res = await authService.forgotPassword(data.identity);
      setStatus({
        type: "success",
        message:
          res.message ||
          "Mã khôi phục đã được gửi. Vui lòng kiểm tra email hoặc điện thoại của bạn.",
      });
      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Không thể gửi mã khôi phục. Vui lòng thử lại sau!";
      setStatus({
        type: "error",
        message: errorMsg,
      });
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Nửa Trái: Banner ảnh mỹ phẩm (ẩn trên mobile, hiện từ lg) */}
      <AuthBanner />

      {/* Nửa Phải: Form Khôi phục mật khẩu */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative py-10 px-6 sm:px-10 min-h-screen overflow-y-auto">
        {/* Nút X quay về trang chủ */}
        <Link
          to="/"
          className="absolute top-6 right-6 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
          aria-label="Về trang chủ"
        >
          <X size={28} />
        </Link>

        <div className="w-full max-w-md my-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 uppercase mb-2">
            Khôi Phục Mật Khẩu
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mb-6">
            Nhập số điện thoại hoặc email bạn đã đăng ký để nhận mã khôi phục.
          </p>

          {/* Thông báo kết quả */}
          {status.message && (
            <div
              className={`mb-6 p-3 rounded-lg text-xs sm:text-sm font-medium ${
                status.type === "error"
                  ? "bg-red-50 text-red-600 border border-red-200"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
              }`}
            >
              {status.message}
            </div>
          )}

          {errors.identity && (
            <div className="text-red-500 mb-4 text-xs sm:text-sm font-medium">
              {errors.identity.message}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Input Số điện thoại / Email - Floating Label gạch chân */}
            <div className="relative">
              <input
                type="text"
                id="reset-identity"
                className="peer w-full bg-transparent border-0 border-b border-gray-300 text-gray-900 focus:outline-none focus:border-rose-500 focus:ring-0 placeholder-transparent py-2 text-sm transition-colors"
                placeholder="Số điện thoại / Email"
                {...register("identity")}
              />
              <label
                htmlFor="reset-identity"
                className="absolute left-0 -top-3.5 text-gray-500 text-xs sm:text-sm transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-xs sm:peer-focus:text-sm peer-focus:text-rose-600 cursor-text"
              >
                Số điện thoại / Email
              </label>
            </div>

            {/* Nút gửi mã khôi phục */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-bold py-3 uppercase tracking-wider transition-colors flex justify-center items-center gap-2 cursor-pointer text-sm shadow-xs"
            >
              {isSubmitting && <Loader2 className="animate-spin" size={18} />}
              {isSubmitting ? "Đang xử lý..." : "Gửi Mã Khôi Phục"}
            </button>

            {/* Nút quay lại đăng nhập */}
            <div className="text-center mt-6">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-gray-500 hover:text-rose-600 text-sm font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại Đăng nhập</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
