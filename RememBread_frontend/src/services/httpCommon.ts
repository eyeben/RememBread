import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { tokenUtils } from '@/lib/queryClient';

const http = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // refreshToken을 쿠키로 보낼 수 있게 설정
});

// 토큰 재발급 시도 횟수를 추적하는 변수
let isRefreshing = false;

// 요청 인터셉터: accessToken 자동 추가
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const accessToken = tokenUtils.getToken();
    
    // headers가 undefined일 수 있으므로 기본값 설정
    config.headers = config.headers || {};
    
    // accessToken이 있으면 Bearer 토큰으로 설정, 없으면 빈 문자열로 설정
    config.headers['Authorization'] = accessToken ? `Bearer ${accessToken}` : 'Bearer idonthaveaccesstoken';
    
    return config;
});

// 응답 인터셉터: accessToken 만료되었을 때 자동 재발급
http.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig;

        // TOKEN4002 에러 처리
        if (error.response?.data && 
            typeof error.response.data === 'object' && 
            'code' in error.response.data &&
            'isSuccess' in error.response.data &&
            error.response.data.code === 'TOKEN4002' && 
            error.response.data.isSuccess === false
        ) {
            tokenUtils.removeToken();
            return Promise.reject(error);
        }

        if (
            error.response?.status === 401 &&
            !isRefreshing
        ) {
            console.log('토큰 재발급 시도 시작');
            isRefreshing = true;
            try {
                const isRefreshed = await tokenUtils.tryRefreshToken();
                console.log('토큰 재발급 결과:', isRefreshed);
                
                if (isRefreshed) {
                    const newAccessToken = tokenUtils.getToken();
                    originalRequest.headers = originalRequest.headers || {};
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    isRefreshing = false;
                    return http(originalRequest);
                } else {
                    console.log('토큰 재발급 실패, 로그아웃 처리');
                    isRefreshing = false;
                    tokenUtils.removeToken();
                    return Promise.reject(error);
                }
            } catch (refreshError) {
                console.error('토큰 재발급 중 에러 발생:', refreshError);
                isRefreshing = false;
                tokenUtils.removeToken();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
export default http; 