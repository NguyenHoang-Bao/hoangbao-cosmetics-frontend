import axios, {type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig, type AxiosResponse} from "axios";
import { tokenManager } from "./tokenManager";

// Lay Base URL tu Vite env, fallback qua IP backend AWS neu sai file .env
const BASE_URL = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE_URL) || 'http://13.212.78.140:8080/api';

// Khoi tao va khai bao dung chung
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, 
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});


// Ham .use(dung, sai)
// interceptors.request - interceptors.reponse dung toan cuc/ cuc bo khong dung
// Promise(pending-Fulfilled Resolved- reject)




// Mau REQUEST kem theo token JWT
apiClient.interceptors.request.use(
    (req:InternalAxiosRequestConfig) =>{
        const token = tokenManager.getAccessToken();
        //if check ton tai token access va headers json chua
        if(token && req.headers){
            //noi chuoi Bearer + token gan vao thuoc tinh Authorization va them cap key: value nay vao headers cua req
            req.headers.Authorization = `Bearer ${token}`;
        }
        return req; 
    },
    (error)=>Promise.reject(error)
);

// Mau REPONSE tra ve- bat loi he thong
apiClient.interceptors.response.use(
    (res: AxiosResponse) =>{
        //Tra ve thang body JSON(ApiResponse<T> -file common type)
        return res.data;
    },
     (error: AxiosError<{ message?: string; success?: boolean }>) => {
    // Loi server khong phan hoi
    if (!error.response) {
      return Promise.reject(new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng!'));
    }
    const { status, data } = error.response;
    // Loi 401 Unauthorized: Token het han hoac k dung -> xoa token
    if (status === 401) {
      tokenManager.clearTokens();
    }
    // Message loi backend tra ve
    const serverMessage = data?.message || `Lỗi máy chủ (${status})`;
    return Promise.reject(new Error(serverMessage));
  }
)