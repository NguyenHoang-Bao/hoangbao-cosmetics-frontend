import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Camera, CheckCircle2, AlertCircle, Loader2, Award, ShieldCheck, Mail, Phone, User as UserIcon } from 'lucide-react';
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
      setSuccessMessage('Hồ sơ của bạn đã được cập nhật thành công!');
    } catch (err: any) {
      setErrorMessage(err.message || 'Cập nhật hồ sơ thất bại. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tính cấp bậc thành viên dựa trên điểm tích lũy
  const points = profile.loyaltyPoints || 0;
  const memberRank =
    points >= 1500
      ? { title: 'Kim Cương', color: 'from-amber-400 to-rose-500', text: 'text-rose-600', bg: 'bg-rose-50' }
      : points >= 500
      ? { title: 'Vàng', color: 'from-amber-300 to-amber-500', text: 'text-amber-600', bg: 'bg-amber-50' }
      : { title: 'Bạc', color: 'from-slate-300 to-slate-500', text: 'text-slate-600', bg: 'bg-slate-100' };

  return (
    <div className="space-y-6">
      {/* Thông tin nhanh về hạng thành viên & điểm thưởng */}
      <div className="bg-gradient-to-r from-rose-50 via-white to-pink-50 border border-rose-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md">
            <Award size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-neutral-500">Hạng thành viên</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${memberRank.bg} ${memberRank.text}`}>
                {memberRank.title}
              </span>
            </div>
            <p className="text-sm font-extrabold text-neutral-900 mt-0.5">
              {profile.fullName || profile.username}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-rose-100 pt-3 sm:pt-0 sm:pl-6">
          <div>
            <p className="text-xs text-neutral-500">Điểm tích lũy</p>
            <p className="text-lg font-black text-rose-600">{points.toLocaleString('vi-VN')} <span className="text-xs font-normal">điểm</span></p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">Loại tài khoản</p>
            <div className="flex items-center gap-1 text-xs font-semibold text-neutral-700">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>{profile.authProvider || 'LOCAL'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Thông báo kết quả */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-sm">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800 text-sm">
          <AlertCircle size={18} className="shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form cập nhật thông tin */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cột trái: Form thông tin cá nhân */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Tên tài khoản (Username)
            </label>
            <div className="relative">
              <input
                type="text"
                disabled
                value={profile.username}
                className="w-full px-3.5 py-2.5 text-sm bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-500 cursor-not-allowed font-mono"
              />
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">Tên đăng nhập không thể chỉnh sửa.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Họ và tên <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <UserIcon size={16} />
              </div>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Số điện thoại
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <Phone size={16} />
              </div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="0359490221"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">Dùng để giao hàng và liên hệ bảo hành đơn hàng.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Địa chỉ Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <Mail size={16} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-neutral-300 text-white text-sm font-semibold rounded-xl shadow-md shadow-rose-200 transition-all flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Đang lưu thay đổi...</span>
                </>
              ) : (
                <span>Lưu thông tin</span>
              )}
            </button>
          </div>
        </div>

        {/* Cột phải: Ảnh đại diện Avatar (Shopee/Lazada style) */}
        <div className="flex flex-col items-center justify-start border-t md:border-t-0 md:border-l border-neutral-100 pt-6 md:pt-0 md:pl-8 text-center">
          <p className="text-xs font-semibold text-neutral-700 mb-3">Ảnh đại diện</p>

          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-32 h-32 rounded-full overflow-hidden bg-rose-50 border-2 border-rose-200 flex items-center justify-center shadow-inner">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-rose-50 flex items-center justify-center text-rose-500 font-bold text-3xl">
                  {fullName ? fullName.charAt(0).toUpperCase() : profile.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={24} />
              <span className="text-[11px] font-medium mt-1">Đổi ảnh</span>
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
            className="mt-3 px-4 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            Chọn ảnh từ máy
          </button>

          <div className="text-[11px] text-neutral-400 mt-2 space-y-0.5">
            <p>Dung lượng tối đa: 2 MB</p>
            <p>Định dạng: JPG, PNG, WEBP</p>
          </div>

          {avatarError && (
            <p className="mt-2 text-xs text-rose-500 font-medium bg-rose-50 px-2.5 py-1 rounded-md border border-rose-100">
              {avatarError}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};
