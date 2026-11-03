import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  User,
  MapPin,
  Lock,
  ShoppingBag,
  LogOut,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import type { UserProfile } from '@hoangbao/types';
import { profileApi } from '../api/profileApi';
import { logout } from '../../auth/store/authSlice';
import { ProfileOverviewTab } from '../components/ProfileOverviewTab';
import { AddressBookTab } from '../components/AddressBookTab';
import { SecurityTab } from '../components/SecurityTab';

type TabType = 'profile' | 'addresses' | 'security';

export const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: profileApi.getProfile,
    staleTime: 1000 * 60 * 5, // 5 phút
    retry: 1,
  });

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?')) {
      dispatch(logout());
      navigate('/login');
    }
  };

  const handleProfileUpdated = (updated: UserProfile) => {
    queryClient.setQueryData(['userProfile'], updated);
  };

  return (
    <div className="min-h-screen bg-neutral-50/60 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb điều hướng */}
        <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-6 font-medium">
          <Link to="/" className="hover:text-rose-600 transition-colors">
            Trang chủ
          </Link>
          <ChevronRight size={14} />
          <span className="text-neutral-700">Tài khoản của tôi</span>
        </nav>

        {/* Khung tải dữ liệu (Loading Skeleton) */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
            <div className="bg-white rounded-3xl p-6 border border-neutral-200 h-80" />
            <div className="md:col-span-3 bg-white rounded-3xl p-8 border border-neutral-200 h-96" />
          </div>
        )}

        {/* Lỗi tải thông tin */}
        {isError && (
          <div className="bg-white rounded-3xl p-10 border border-rose-200 text-center max-w-lg mx-auto space-y-4">
            <AlertCircle size={44} className="mx-auto text-rose-500" />
            <h3 className="text-lg font-bold text-neutral-900">Không thể tải thông tin tài khoản</h3>
            <p className="text-xs text-neutral-500">
              {(error as Error)?.message || 'Vui lòng kiểm tra lại kết nối mạng hoặc phiên đăng nhập của bạn.'}
            </p>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-700 transition-colors cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>Thử lại</span>
            </button>
          </div>
        )}

        {/* Nội dung chính khi tải thành công */}
        {!isLoading && !isError && profile && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
            {/* Cột trái: Sidebar Menu Điều Hướng */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-6">
              {/* Thông tin vắn tắt user */}
              <div className="flex items-center gap-3.5 pb-6 border-b border-neutral-100">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-rose-50 border-2 border-rose-200 flex items-center justify-center shrink-0 shadow-inner">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-rose-600 font-bold text-xl">
                      {profile.fullName?.charAt(0) || profile.username.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-extrabold text-neutral-900 truncate">
                    {profile.fullName || profile.username}
                  </p>
                  <p className="text-xs text-neutral-400 truncate">{profile.email || `@${profile.username}`}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full mt-1">
                    <Sparkles size={10} />
                    <span>{profile.loyaltyPoints || 0} điểm</span>
                  </span>
                </div>
              </div>

              {/* Danh sách tab điều hướng */}
              <nav className="space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-rose-50 text-rose-600 shadow-xs'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                >
                  <User size={16} />
                  <span>Hồ sơ cá nhân</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'addresses'
                      ? 'bg-rose-50 text-rose-600 shadow-xs'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                >
                  <MapPin size={16} />
                  <span>Sổ địa chỉ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'security'
                      ? 'bg-rose-50 text-rose-600 shadow-xs'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                >
                  <Lock size={16} />
                  <span>Bảo mật & Mật khẩu</span>
                </button>

                <Link
                  to="/my-orders"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-all"
                >
                  <ShoppingBag size={16} />
                  <span>Đơn mua của tôi</span>
                </Link>

                <div className="pt-3 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-neutral-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <LogOut size={16} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </nav>
            </div>

            {/* Cột phải: Khung nội dung chi tiết của Tab đang chọn */}
            <div className="md:col-span-3 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs">
              {activeTab === 'profile' && (
                <ProfileOverviewTab profile={profile} onProfileUpdated={handleProfileUpdated} />
              )}
              {activeTab === 'addresses' && <AddressBookTab profile={profile} />}
              {activeTab === 'security' && <SecurityTab profile={profile} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
