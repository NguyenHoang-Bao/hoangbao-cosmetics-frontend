//Vi moi lan xai token trong localstorage phai viet lenh rieng nen tao file nay dung chung

const ACCESS_TOKEN_KEY = "hb_access_token";
const REFRESH_TOKEN_KEY = "hb_refresh_token";

//Dieu kien check xem may dang nhap la client hay server
//xai typeof check: server khong window return undefined - may tinh binh thuong tra ve object
const isClient = typeof window !== "undefined";

export const tokenManager = {

    //Lay access token
    getAccessToken: (): string | null =>{
        if(!isClient) return null;
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    },

    //Set token cho bien ACCESS
    setAccessToken: (token:string):void =>{
        if(isClient)
            localStorage.setItem(ACCESS_TOKEN_KEY, token);
    },

    //Lay token sau khi Refresh
    getRefreshToken: (): string|null =>{
        if(!isClient) return null;
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    },

    //Set token cho bien REFRESH
    setRefreshToken: (refreshToken:string):void =>{
        if(isClient) 
            localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    },

    // Clear token 
    clearTokens: (): void =>{
        if(isClient){
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
        }
    } 
}