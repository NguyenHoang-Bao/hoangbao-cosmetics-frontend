import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import type { UserProfile } from '@hoangbao/types';
import { profileApi } from '../api/profileApi';

interface SecurityTabProps {
  profile: UserProfile;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({ profile }) => {
  const isOAuth = profile.authProvider && profile.authProvider.toUpperCase() !== 'LOCAL';

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!oldPassword) {
      setErrorMessage('Vui lòng nhập mật khẩu hiện tại của bạn.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('Mật khẩu mới phải có tối thiểu 6 ký tự.');
      return;
    }

    if (newPassword === oldPassword) {
      setErrorMessage('Mật khẩu mới không được trùng với mật khẩu hiện tại.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không trùng khớp với mật khẩu mới.');
      return;
    }

    try {
      setIsSubmitting(true);
      await profileApi.changePassword({
        oldPassword,
        newPassword,
        confirmPassword,
      });

      setSuccessMessage('Đổi mật khẩu thành công! Tài khoản của bạn đã được cập nhật.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Không thể đổi mật khẩu. Vui lòng kiểm tra lại mật khẩu hiện tại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isOAuth) {
    return (
      <div>
        <div className="pb-4 mb-6 border-b border-neutral-100">
          <h2 className="text-lg font-bold text-neutral-800">Bảo Mật Tài Khoản</h2>
          <p className="text-xs text-neutral-500 mt-1">
            Quản lý phương thức xác thực và bảo mật đăng nhập
          </p>
        </div>

        <div className="p-6 bg-neutral-50 rounded-xl border border-neutral-200 max-w-lg space-y-2">
          <h4 className="text-sm font-bold text-neutral-800">
            Tài khoản liên kết {profile.authProvider}
          </h4>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Bạn đang đăng nhập qua tài khoản liên kết{' '}
            <strong className="text-rose-600 uppercase font-bold">{profile.authProvider}</strong>. 
            Hệ thống không lưu trữ mật khẩu nội bộ cho tài khoản này.
          </p>
          <p className="text-[11px] text-neutral-400 pt-2">
            Để đổi mật khẩu hoặc bật xác thực 2 bước, vui lòng quản lý trực tiếp tại trang bảo mật của {profile.authProvider}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="pb-4 mb-6 border-b border-neutral-100">
        <h2 className="text-lg font-bold text-neutral-800">Đổi Mật Khẩu</h2>
        <p className="text-xs text-neutral-500 mt-1">
          Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
        </p>
      </div>

      {successMessage && (
        <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle size={16} className="text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <label className="sm:w-36 text-xs font-medium text-neutral-600 sm:text-right shrink-0">
            Mật khẩu hiện tại <span className="text-rose-600">*</span>
          </label>
          <div className="relative flex-1">
            <input
              type={showOld ? 'text' : 'password'}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Nhập mật khẩu hiện tại"
              className="w-full px-3.5 pr-10 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-rose-500 text-neutral-800"
            />
            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 cursor-pointer"
            >
              {showOld ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <label className="sm:w-36 text-xs font-medium text-neutral-600 sm:text-right shrink-0">
            Mật khẩu mới <span className="text-rose-600">*</span>
          </label>
          <div className="relative flex-1">
            <input
              type={showNew ? 'text' : 'password'}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mật khẩu tối thiểu 6 ký tự"
              className="w-full px-3.5 pr-10 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-rose-500 text-neutral-800"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 cursor-pointer"
            >
              {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <label className="sm:w-36 text-xs font-medium text-neutral-600 sm:text-right shrink-0">
            Xác nhận mật khẩu <span className="text-rose-600">*</span>
          </label>
          <div className="relative flex-1">
            <input
              type={showConfirm ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu mới"
              className="w-full px-3.5 pr-10 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-rose-500 text-neutral-800"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 cursor-pointer"
            >
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 pt-3">
          <div className="sm:w-36 hidden sm:block shrink-0" />
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-neutral-300 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <span>Xác nhận</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
