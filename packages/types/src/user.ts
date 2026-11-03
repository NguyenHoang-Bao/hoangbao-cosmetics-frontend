export interface UserProfile {
  idUser: number;
  username: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
  loyaltyPoints?: number;
  authProvider?: string;
  enabled?: boolean;
  emailVerified?: boolean;
  roles?: string[];
}

export interface UpdateProfileRequest {
  fullName: string;
  phoneNumber?: string;
  email?: string;
  avatar?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserAddress {
  id: string;
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  label?: 'Nhà riêng' | 'Văn phòng';
  isDefault?: boolean;
}
