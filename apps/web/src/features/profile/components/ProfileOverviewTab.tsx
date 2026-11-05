import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
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

  // Cấp bậc thành viên
  const points = profile.loyaltyPoints || 0;
  const memberRank =
    points >= 1500 ? 'Thành Viên Kim Cương' : points >= 500 ? 'Thành Viên Vàng' : 'Thành Viên Bạc';

  return (
    <div>
      {/* Tiêu đề mục Hồ sơ chuẩn Shopee */}
      <div className="pb-4 mb-6 border-b border-neutral-100">
        <h2 className="text-lg font-bold text-neutral-800">Hồ Sơ Của Tôi</h2>
        <p className="text-xs text-neutral-500 mt-1">
          Quản lý thông tin hồ sơ để bảo mật tài khoản và giao hàng chính xác
        </p>
      </div>

      {/* Thông báo kết quả */}
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

      {/* Bố cục 2 cột chuẩn Shopee: Trái Form - Phải Avatar */}
      <form onSubmit={handleSubmit} className="flex flex-col-reverse md:flex-row gap-8 lg:gap-12">
        {/* Cột trái: Các trường thông tin */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <label className="sm:w-32 text-xs font-medium text-neutral-600 sm:text-right shrink-0">
              Tên đăng nhập
            </label>
            <div className="flex-1">
              <span className="text-sm font-semibold text-neutral-800 font-mono">
                {profile.username}
              </span>
              <p className="text-[11px] text-neutral-400 mt-0.5">Tên đăng nhập không thể thay đổi</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <label className="sm:w-32 text-xs font-medium text-neutral-600 sm:text-right shrink-0">
              Họ và tên <span className="text-rose-600">*</span>
            </label>
            <div className="flex-1">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nhập họ và tên của bạn"
                className="w-full max-w-md px-3.5 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-rose-500 text-neutral-800"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <label className="sm:w-32 text-xs font-medium text-neutral-600 sm:text-right shrink-0">
              Số điện thoại
            </label>
            <div className="flex-1">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Ví dụ: 0359490221"
                className="w-full max-w-md px-3.5 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-rose-500 text-neutral-800 font-mono"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <label className="sm:w-32 text-xs font-medium text-neutral-600 sm:text-right shrink-0">
              Email
            </label>
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full max-w-md px-3.5 py-2 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-rose-500 text-neutral-800"
              />
            </div>
          </div>

          {/* Điểm thưởng & Cấp bậc Shopee Mall Member */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 pt-2">
            <label className="sm:w-32 text-xs font-medium text-neutral-600 sm:text-right shrink-0">
              Cấp bậc thành viên
            </label>
            <div className="flex-1 flex items-center gap-3">
              <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                {memberRank}
              </span>
              <span className="text-xs text-neutral-500">
                (Điểm tích lũy: <strong className="text-neutral-800">{points} điểm</strong>)
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <label className="sm:w-32 text-xs font-medium text-neutral-600 sm:text-right shrink-0">
              Xác thực
            </label>
            <div className="flex-1 text-xs text-neutral-700">
              Tài khoản {profile.authProvider === 'LOCAL' ? 'mật khẩu nội bộ' : `liên kết ${profile.authProvider}`}
            </div>
          </div>

          {/* Nút Lưu Shopee Style */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 pt-4">
            <div className="sm:w-32 hidden sm:block shrink-0" />
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-neutral-300 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
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
        </div>

        {/* Cột phải: Khung ảnh đại diện Shopee */}
        <div className="w-full md:w-60 flex flex-col items-center justify-center border-b md:border-b-0 md:border-l border-neutral-100 pb-6 md:pb-0 md:pl-6 text-center shrink-0">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity shadow-xs"
            title="Bấm để chọn ảnh mới"
          >
            {avatar ? (
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-3xl">
                {fullName ? fullName.charAt(0).toUpperCase() : profile.username.charAt(0).toUpperCase()}
              </div>
            )}
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
            className="mt-4 px-4 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            Chọn Ảnh
          </button>

          <div className="text-[11px] text-neutral-400 mt-2 space-y-0.5">
            <p>Dung lượng file tối đa 2 MB</p>
            <p>Định dạng: JPEG, PNG, WEBP</p>
          </div>

          {avatarError && (
            <p className="mt-2 text-xs text-rose-600 font-medium">
              {avatarError}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};
