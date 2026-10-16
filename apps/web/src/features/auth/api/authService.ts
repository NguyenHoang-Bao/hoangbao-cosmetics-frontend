import { apiClient } from '@hoangbao/api-client';
import type { ApiResponse, AuthResponse, LoginRequest, RegisterRequest } from '@hoangbao/types';

// Tang goi API Backend Spring Boot AWS (13.212.78.140:8080/api)
export const authService = {
  // 1. Goi API dang nhap
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<any, ApiResponse<AuthResponse>>('/auth/login', credentials);
    return response.data;
  },

  // 2. Goi API dang ky
  register: async (data: RegisterRequest): Promise<void> => {
    const payload = {
      username: data.username,
      password: data.password,
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phoneNumber || data.phone,
    };
    await apiClient.post('/auth/register', payload);
  },

  // 3. Goi API Google OAuth
  loginGoogle: async (idToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<any, ApiResponse<AuthResponse>>('/auth/google', { idToken });
    return response.data;
  },

  // 4. Goi API Facebook OAuth
  loginFacebook: async (accessToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<any, ApiResponse<AuthResponse>>('/auth/facebook', { accessToken });
    return response.data;
  },
};
