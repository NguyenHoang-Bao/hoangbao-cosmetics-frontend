import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Camera, Check, AlertCircle, Loader2 } from 'lucide-react';
import type { UserProfile } from '@hoangbao/types';
import { profileApi } from '../api/profileApi';
import { updateUser } from '../../auth/store/authSlice';

interface ProfileOverviewTabProps {
  profile: UserProfile;
  onProfileUpdated: (updated: UserProfile) => void;
}

export const ProfileOverviewTab: React.FC<ProfileOverviewTabProps> = ({
  profile,
  onProfileUpdated,
}) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(profile.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(profile.phoneNumber || '');
  const [email, setEmail] = useState(profile.email || '');
  const [avatar, setAvatar] = useState(profile.avatar || '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  // Xử lý chọn ảnh đại diện và chuyển sang Base64
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setAvatarError('Chỉ hỗ trợ file ảnh định dạng JPG, PNG hoặc WEBP');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setAvatarError('Dung lượng ảnh tối đa 2MB');
      return;
    }

    setAvatarError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Vui lòng nhập họ và tên của bạn.');
      return;
    }

    if (phoneNumber && !/^(0[3|5|7|8|9])[0-9]{8}$/.test(phoneNumber.trim())) {
      setErrorMessage('Số điện thoại không đúng định dạng 10 số của Việt Nam (bắt đầu bằng 03, 05, 07, 08, 09).');
      return;
    }

    try {
      setIsSubmitting(true);
      const updated = await profileApi.updateProfile({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim() || undefined,
        email: email.trim() || undefined,
        avatar: avatar || undefined,
      });

      // Cập nhật Redux store để Header tự động đổi tên & avatar ngay lập tức
      dispatch(
        updateUser({
          fullName: updated.fullName,
          phone: updated.phoneNumber,
          avatar: updated.avatar,
        })
      );

      onProfileUpdated(updated);
      setSuccessMessage('Hồ sơ của bạn đã được cập nhật thành công.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Cập nhật hồ sơ thất bại. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tính cấp bậc thành viên theo điểm
  const points = profile.loyaltyPoints || 0;
  const memberRank =
    points >= 1500
      ? 'HẠNG KIM CƯƠNG'
      : points >= 500
      ? 'HẠNG VÀNG'
      : 'HẠNG BẠC';

  return (
    <div className="space-y-8">
      {/* Header tóm tắt thông tin thành viên (Chuẩn Minimalist Editorial) */}
      <div className="border border-neutral-200 bg-neutral-50/70 p-5 sm:p-6 rounded-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-neutral-200">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-neutral-400 font-bold block mb-1">
              Thành viên Hoàng Bảo
            </span>
            <p className="text-base font-bold text-neutral-900 tracking-tight">
              {profile.fullName || profile.username}
            </p>
            <p className="text-xs text-neutral-500 font-mono mt-0.5">{profile.email || `@${profile.username}`}</p>
          </div>

          <div className="pt-4 sm:pt-0 sm:pl-6">
            <span className="text-[11px] uppercase tracking-widest text-neutral-400 font-bold block mb-1">
              Điểm thưởng tích lũy
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-mono text-neutral-900">
                {points.toLocaleString('vi-VN')}
              </span>
              <span className="text-xs text-neutral-500">điểm</span>
            </div>
            <p className="text-[11px] font-bold tracking-wider text-rose-600 uppercase mt-1">
              {memberRank}
            </p>
          </div>

          <div className="pt-4 sm:pt-0 sm:pl-6">
            <span className="text-[11px] uppercase tracking-widest text-neutral-400 font-bold block mb-1">
              Phương thức xác thực
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                {profile.authProvider || 'LOCAL'}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">
              {profile.authProvider === 'LOCAL' ? 'Mật khẩu hệ thống' : `Liên kết ${profile.authProvider}`}
            </p>
          </div>
        </div>
      </div>

      {/* Thông báo kết quả */}
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

      {/* Form cập nhật thông tin */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Cột trái: Form thông tin cá nhân */}
        <div className="md:col-span-2 space-y-5">
          <div>
            <label className="block text-[11px] uppercase font-bold tracking-wider text-neutral-500 mb-1.5">
              Tên tài khoản
            </label>
            <input
              type="text"
              disabled
              value={profile.username}
              className="w-full px-3.5 py-2.5 text-xs bg-neutral-100 border border-neutral-200 rounded-sm text-neutral-400 font-mono cursor-not-allowed"
            />
            <p className="text-[10px] text-neutral-400 mt-1">Tên tài khoản đăng ký cố định.</p>
          </div>

          <div>
            <label className="block text-[11px] uppercase font-bold tracking-wider text-neutral-700 mb-1.5">
              Họ và tên <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nguyễn Văn A"
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 rounded-sm focus:border-neutral-900 focus:outline-none transition-colors text-neutral-900 placeholder:text-neutral-300"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase font-bold tracking-wider text-neutral-700 mb-1.5">
              Số điện thoại
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="0359490221"
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 rounded-sm focus:border-neutral-900 focus:outline-none transition-colors text-neutral-900 placeholder:text-neutral-300 font-mono"
            />
            <p className="text-[10px] text-neutral-400 mt-1">Dùng để giao nhận hàng và tra cứu bảo hành.</p>
          </div>

          <div>
            <label className="block text-[11px] uppercase font-bold tracking-wider text-neutral-700 mb-1.5">
              Địa chỉ Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 rounded-sm focus:border-neutral-900 focus:outline-none transition-colors text-neutral-900 placeholder:text-neutral-300"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-7 py-3 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white text-xs uppercase font-bold tracking-widest rounded-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <span>Lưu thay đổi</span>
              )}
            </button>
          </div>
        </div>

        {/* Cột phải: Khung ảnh đại diện tối giản */}
        <div className="flex flex-col items-center justify-start border-t md:border-t-0 md:border-l border-neutral-200 pt-8 md:pt-0 md:pl-8 text-center">
          <label className="block text-[11px] uppercase font-bold tracking-wider text-neutral-500 mb-3">
            Ảnh đại diện
          </label>

          <div
            className="w-32 h-32 rounded-sm overflow-hidden bg-neutral-100 border border-neutral-200 relative group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {avatar ? (
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400 font-serif text-3xl font-bold bg-neutral-100">
                {fullName ? fullName.charAt(0).toUpperCase() : profile.username.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="absolute inset-0 bg-neutral-900/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={20} />
              <span className="text-[10px] uppercase tracking-wider font-bold mt-1">Thay đổi</span>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleAvatarChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 text-xs font-semibold text-neutral-700 hover:text-neutral-900 underline underline-offset-4 cursor-pointer"
          >
            Chọn ảnh mới
          </button>

          <div className="text-[10px] text-neutral-400 mt-2 space-y-0.5">
            <p>Định dạng: JPG, PNG, WEBP</p>
            <p>Dung lượng tối đa: 2 MB</p>
          </div>

          {avatarError && (
            <p className="mt-2 text-[11px] text-rose-600 font-medium">
              {avatarError}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};
