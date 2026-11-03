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
    <div className="min-h-screen bg-neutral-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb tối giản */}
        <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-8 font-medium">
          <Link to="/" className="hover:text-neutral-900 transition-colors uppercase tracking-wider text-[11px]">
            Trang chủ
          </Link>
          <ChevronRight size={12} />
          <span className="text-neutral-900 uppercase tracking-wider text-[11px] font-semibold">Tài khoản</span>
        </nav>

        {/* Khung tải dữ liệu (Loading Skeleton) */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
            <div className="bg-white rounded-sm p-6 border border-neutral-200 h-80" />
            <div className="md:col-span-3 bg-white rounded-sm p-8 border border-neutral-200 h-96" />
          </div>
        )}

        {/* Lỗi tải thông tin */}
        {isError && (
          <div className="bg-white rounded-sm p-10 border border-neutral-200 text-center max-w-lg mx-auto space-y-4">
            <AlertCircle size={36} className="mx-auto text-rose-600" />
            <h3 className="text-sm uppercase font-bold tracking-wider text-neutral-900">
              Không thể tải thông tin tài khoản
            </h3>
            <p className="text-xs text-neutral-500">
              {(error as Error)?.message || 'Vui lòng kiểm tra lại kết nối mạng.'}
            </p>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-neutral-900 text-white text-xs uppercase font-bold tracking-wider rounded-sm hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>Thử lại</span>
            </button>
          </div>
        )}

        {/* Nội dung chính khi tải thành công */}
        {!isLoading && !isError && profile && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
            {/* Cột trái: Sidebar điều hướng tối giản */}
            <div className="bg-white rounded-sm p-6 border border-neutral-200 space-y-6">
              {/* Thông tin vắn tắt user */}
              <div className="flex items-center gap-3.5 pb-6 border-b border-neutral-200">
                <div className="w-12 h-12 rounded-sm overflow-hidden bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-neutral-700 font-bold text-base font-serif">
                      {profile.fullName?.charAt(0) || profile.username.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-900 truncate">
                    {profile.fullName || profile.username}
                  </p>
                  <p className="text-[11px] text-neutral-400 font-mono truncate">{profile.email || `@${profile.username}`}</p>
                </div>
              </div>

              {/* Danh sách tab điều hướng */}
              <nav className="space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer text-left ${
                    activeTab === 'profile'
                      ? 'border-l-2 border-neutral-900 bg-neutral-50 text-neutral-900'
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50/60'
                  }`}
                >
                  <User size={15} />
                  <span>Hồ sơ cá nhân</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer text-left ${
                    activeTab === 'addresses'
                      ? 'border-l-2 border-neutral-900 bg-neutral-50 text-neutral-900'
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50/60'
                  }`}
                >
                  <MapPin size={15} />
                  <span>Sổ địa chỉ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer text-left ${
                    activeTab === 'security'
                      ? 'border-l-2 border-neutral-900 bg-neutral-50 text-neutral-900'
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50/60'
                  }`}
                >
                  <Lock size={15} />
                  <span>Bảo mật</span>
                </button>

                <Link
                  to="/my-orders"
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs uppercase font-bold tracking-wider text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50/60 transition-colors text-left"
                >
                  <ShoppingBag size={15} />
                  <span>Đơn mua của tôi</span>
                </Link>

                <div className="pt-4 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs uppercase font-bold tracking-wider text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer text-left"
                  >
                    <LogOut size={15} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </nav>
            </div>

            {/* Cột phải: Khung nội dung chi tiết của Tab đang chọn */}
            <div className="md:col-span-3 bg-white rounded-sm p-6 sm:p-8 border border-neutral-200">
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
