import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  User,
  ShoppingBag,
  LogOut,
  ChevronRight,
  AlertCircle,
  Edit2,
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
    <div className="min-h-screen bg-[#F5F5FA] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-neutral-500 mb-4 font-normal">
          <Link to="/" className="hover:text-rose-600 transition-colors">
            Trang chủ
          </Link>
          <ChevronRight size={13} className="text-neutral-400" />
          <span className="text-neutral-800 font-medium">Tài khoản của tôi</span>
        </nav>

        {/* Khung tải dữ liệu (Loading Skeleton) */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
            <div className="bg-white rounded-xl p-6 border border-neutral-200/80 h-80" />
            <div className="md:col-span-3 bg-white rounded-xl p-8 border border-neutral-200/80 h-96" />
          </div>
        )}

        {/* Lỗi tải thông tin */}
        {isError && (
          <div className="bg-white rounded-xl p-8 border border-rose-200 text-center max-w-md mx-auto space-y-4 shadow-xs my-6">
            <AlertCircle size={36} className="mx-auto text-rose-500" />
            <h3 className="text-sm font-bold text-neutral-800">
              Không thể tải thông tin tài khoản
            </h3>
            <p className="text-xs text-neutral-500">
              {(error as Error)?.message || 'Vui lòng kiểm tra lại kết nối mạng.'}
            </p>
            <button
              onClick={() => refetch()}
              className="px-5 py-2 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700 transition-colors cursor-pointer"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Bố cục chính Shopee Mall: Cột trái Sidebar - Cột phải Nội dung Card */}
        {!isLoading && !isError && profile && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
            {/* Cột trái: Sidebar tài khoản Shopee Style */}
            <div className="space-y-6">
              {/* Header profile vắn tắt */}
              <div className="flex items-center gap-3 pb-4 border-b border-neutral-200">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-rose-50 border border-neutral-200 flex items-center justify-center shrink-0">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-rose-600 font-bold text-lg">
                      {profile.fullName?.charAt(0) || profile.username.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-neutral-800 truncate">
                    {profile.fullName || profile.username}
                  </p>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="text-xs text-neutral-400 hover:text-rose-600 flex items-center gap-1 mt-0.5 cursor-pointer"
                  >
                    <Edit2 size={11} />
                    <span>Sửa hồ sơ</span>
                  </button>
                </div>
              </div>

              {/* Danh sách điều hướng Shopee */}
              <nav className="space-y-2 text-xs">
                <div>
                  <div className="flex items-center gap-2 font-bold text-neutral-800 mb-1.5 px-2">
                    <User size={15} className="text-blue-600" />
                    <span>Tài Khoản Của Tôi</span>
                  </div>
                  <div className="space-y-1 pl-6">
                    <button
                      type="button"
                      onClick={() => setActiveTab('profile')}
                      className={`w-full text-left py-1.5 px-2 rounded-md transition-colors cursor-pointer ${
                        activeTab === 'profile'
                          ? 'text-rose-600 font-bold bg-rose-50/50'
                          : 'text-neutral-600 hover:text-rose-600'
                      }`}
                    >
                      Hồ Sơ
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('addresses')}
                      className={`w-full text-left py-1.5 px-2 rounded-md transition-colors cursor-pointer ${
                        activeTab === 'addresses'
                          ? 'text-rose-600 font-bold bg-rose-50/50'
                          : 'text-neutral-600 hover:text-rose-600'
                      }`}
                    >
                      Địa Chỉ
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('security')}
                      className={`w-full text-left py-1.5 px-2 rounded-md transition-colors cursor-pointer ${
                        activeTab === 'security'
                          ? 'text-rose-600 font-bold bg-rose-50/50'
                          : 'text-neutral-600 hover:text-rose-600'
                      }`}
                    >
                      Đổi Mật Khẩu
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/my-orders"
                    className="flex items-center gap-2 py-2 px-2 font-medium text-neutral-700 hover:text-rose-600 hover:bg-neutral-100/60 rounded-md transition-colors"
                  >
                    <ShoppingBag size={15} className="text-rose-600" />
                    <span>Đơn Mua</span>
                  </Link>
                </div>

                <div className="pt-2 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 py-2 px-2 text-neutral-500 hover:text-rose-600 transition-colors cursor-pointer text-left"
                  >
                    <LogOut size={15} />
                    <span>Đăng Xuất</span>
                  </button>
                </div>
              </nav>
            </div>

            {/* Cột phải: Card nội dung màu trắng chuẩn Shopee */}
            <div className="md:col-span-3 bg-white rounded-xl border border-neutral-200/80 shadow-xs p-6 sm:p-8 min-h-[500px]">
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
