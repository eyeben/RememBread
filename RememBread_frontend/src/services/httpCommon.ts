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

        if (
            error.response?.status === 401 &&
            !originalRequest._retry // 재시도 방지 플래그
        ) {
            originalRequest._retry = true;
            try {
                const isRefreshed = await tokenUtils.tryRefreshToken();
                if (isRefreshed) {
                    // 실패했던 요청 다시 보내기
                    const newAccessToken = tokenUtils.getToken();
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axios(originalRequest);
                }
            } catch (refreshError) {
                console.error('🔒 토큰 재발급 실패:', refreshError);
                tokenUtils.removeToken();
                // 로그인 페이지로 이동
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default http; 