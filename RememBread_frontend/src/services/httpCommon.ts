import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { tokenUtils } from '@/lib/queryClient';

const http = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // refreshToken을 쿠키로 보낼 수 있게 설정
});

// 요청 인터셉터: accessToken 자동 추가
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const accessToken = tokenUtils.getToken();
    // refresh token 재발급 요청인 경우에도 헤더 추가
    if (accessToken || config.url?.includes('/auth/reissue')) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

// 응답 인터셉터: accessToken 만료되었을 때 자동 재발급
http.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // TOKEN4002 에러 처리
        if (error.response?.data && 
            typeof error.response.data === 'object' && 
            'code' in error.response.data &&
            'isSuccess' in error.response.data &&
            error.response.data.code === 'TOKEN4002' && 
            error.response.data.isSuccess === false
        ) {
            console.log('🚫 Refresh Token 만료 (TOKEN4002): 로그인 페이지로 이동');
            tokenUtils.removeToken();
            window.location.href = '/login';
            return Promise.reject(error);
        }

        // 토큰 재발급 요청 중 발생한 에러 처리
        if (originalRequest.url?.includes('/auth/reissue')) {
            console.log('❌ 토큰 재발급 요청 실패: 로그인 페이지로 이동');
            tokenUtils.removeToken();
            window.location.href = '/login';
            return Promise.reject(error);
        }

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            console.log('🔄 401 에러 감지: refresh token으로 재시도');
            originalRequest._retry = true;
            try {
                const isRefreshed = await tokenUtils.tryRefreshToken();
                
                if (isRefreshed) {
                    console.log('✅ 토큰 재발급 성공: 원래 요청 재시도');
                    const newAccessToken = tokenUtils.getToken();
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return http(originalRequest);
                } else {
                    console.log('❌ 토큰 재발급 실패: 로그인 페이지로 이동');
                    tokenUtils.removeToken();
                    window.location.href = '/login';
                    return Promise.reject(error);
                }
            } catch (refreshError) {
                console.error('🔒 토큰 재발급 실패:', refreshError);
                tokenUtils.removeToken();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
export default http; 