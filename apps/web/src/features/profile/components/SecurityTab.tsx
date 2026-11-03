import React, { useState } from 'react';
import { Eye, EyeOff, Check, AlertCircle, Loader2 } from 'lucide-react';
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

      setSuccessMessage('Đổi mật khẩu thành công. Thông tin đăng nhập đã được cập nhật.');
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
      <div className="border border-neutral-200 bg-neutral-50/70 p-6 rounded-sm max-w-xl space-y-3">
        <span className="text-[11px] uppercase tracking-widest text-neutral-400 font-bold block">
          Bảo mật tài khoản liên kết
        </span>
        <h4 className="text-sm font-bold text-neutral-900">
          Đăng nhập qua {profile.authProvider}
        </h4>
        <p className="text-xs text-neutral-600 leading-relaxed">
          Tài khoản của bạn được liên kết và bảo mật bởi nhà cung cấp{' '}
          <strong className="text-neutral-900 uppercase">{profile.authProvider}</strong>. Mật khẩu và bảo mật 2 lớp
          được đồng bộ trực tiếp thông qua tài khoản {profile.authProvider} của bạn.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="pb-4 border-b border-neutral-200">
        <h3 className="text-sm uppercase font-bold tracking-wider text-neutral-900">
          Đổi mật khẩu tài khoản
        </h3>
        <p className="text-xs text-neutral-400 mt-0.5">
          Để bảo vệ tài khoản, vui lòng đặt mật khẩu có độ dài tối thiểu 6 ký tự
        </p>
      </div>

      {successMessage && (
        <div className="p-3.5 bg-neutral-50 border-l-2 border-emerald-600 text-neutral-800 text-xs flex items-center gap-2.5">
          <Check size={16} className="text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 bg-neutral-50 border-l-2 border-rose-600 text-neutral-800 text-xs flex items-center gap-2.5">
          <AlertCircle size={16} className="text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] uppercase font-bold tracking-wider text-neutral-700 mb-1.5">
            Mật khẩu hiện tại <span className="text-rose-600">*</span>
          </label>
          <div className="relative">
            <input
              type={showOld ? 'text' : 'password'}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Nhập mật khẩu hiện tại"
              className="w-full px-3.5 pr-10 py-2.5 text-xs bg-white border border-neutral-300 rounded-sm focus:border-neutral-900 focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-700 cursor-pointer"
            >
              {showOld ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[11px] uppercase font-bold tracking-wider text-neutral-700 mb-1.5">
            Mật khẩu mới <span className="text-rose-600">*</span>
          </label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Tối thiểu 6 ký tự"
              className="w-full px-3.5 pr-10 py-2.5 text-xs bg-white border border-neutral-300 rounded-sm focus:border-neutral-900 focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-700 cursor-pointer"
            >
              {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[11px] uppercase font-bold tracking-wider text-neutral-700 mb-1.5">
            Xác nhận mật khẩu mới <span className="text-rose-600">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu mới"
              className="w-full px-3.5 pr-10 py-2.5 text-xs bg-white border border-neutral-300 rounded-sm focus:border-neutral-900 focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-700 cursor-pointer"
            >
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-7 py-3 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white text-xs uppercase font-bold tracking-widest rounded-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <span>Cập nhật mật khẩu</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
