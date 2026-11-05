import { apiClient } from '@hoangbao/api-client';
import type {
  ApiResponse,
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from '@hoangbao/types';

export const profileApi = {
  // Lấy thông tin cá nhân của người dùng đang đăng nhập
  getProfile: async (): Promise<UserProfile> => {
    const res = await apiClient.get<any, ApiResponse<UserProfile>>('/users/profile');
    return res.data;
  },

  // Cập nhật thông tin cá nhân (họ tên, số điện thoại, email, avatar)
  updateProfile: async (payload: UpdateProfileRequest): Promise<UserProfile> => {
    const res = await apiClient.put<any, ApiResponse<UserProfile>>('/users/profile', payload);
    return res.data;
  },

  // Đổi mật khẩu tài khoản
  changePassword: async (payload: ChangePasswordRequest): Promise<void> => {
    await apiClient.put<any, ApiResponse<void>>('/users/change-password', payload);
  },
};
