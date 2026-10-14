
// CAC INTERFACE GENERIC

// Response tu server
export interface ApiResponse<T>{
    success: boolean;
    message: string;
    data: T;
    timestamp:string;
}

// Response chia trang
export interface PageResponse<T>{
    content: T[];
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

//Response thong bao loi
export interface ApiErrorResponse{
    success: false;
    message: string;
    timestamp: string;
    errors?: Record<string, string> 
}
