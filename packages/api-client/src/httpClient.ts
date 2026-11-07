import axios, {type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig, type AxiosResponse} from "axios";
import { tokenManager } from "./tokenManager";

// Lay Base URL tu Vite env hoac proxy /api neu chay tren Vercel HTTPS de tranh Mixed Content
const getInitialBaseUrl = (): string => {
  // Khi chay tren trinh duyet voi giao thuc HTTPS (Vercel, custom domain) ma backend la HTTP IP,
  // dung relative path /api de Vercel Reverse Proxy chuyen tiep an toan tranh bi chan Mixed Content
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    return '/api';
  }
  return (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE_URL) || 'http://13.212.78.140:8080/api';
};

const BASE_URL = getInitialBaseUrl();

// Khoi tao va khai bao dung chung
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Mau REQUEST kem theo token JWT
apiClient.interceptors.request.use(
    (req:InternalAxiosRequestConfig) =>{
        const token = tokenManager.getAccessToken();
        if(token && req.headers){
            req.headers.Authorization = `Bearer ${token}`;
        }
        return req; 
    },
    (error)=>Promise.reject(error)
);

// Mau REPONSE tra ve- bat loi he thong
apiClient.interceptors.response.use(
    (res: AxiosResponse) =>{
        return res.data;
    },
     (error: AxiosError<{ message?: string; success?: boolean }>) => {
    if (!error.response) {
      return Promise.reject(new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng!'));
    }
    const { status, data } = error.response;
    if (status === 401) {
      tokenManager.clearTokens();
    }
    const serverMessage = data?.message || `Lỗi máy chủ (${status})`;
    return Promise.reject(new Error(serverMessage));
  }
);
