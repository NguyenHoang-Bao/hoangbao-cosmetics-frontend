
//enum role
export type UserRole = "ROLE_CUSTOMER" | "ROLE_ADMIN" | "ROLE_STAFF";

//Thong tin can lay of User
export interface User {
  idUser: number;
  username: string;
  fullName: string;
  email: string;
  avatar?: string;
  phone?: string;
  roles: string[];
}

// Reponse Dang Nhap
export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  idUser: number;
  username: string;
  fullName: string;
  email: string;
  avatar?: string;
  roles: string[];
}

// Request Dang Nhap & Dang Ky
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
}