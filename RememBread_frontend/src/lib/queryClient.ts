import { QueryClient } from "@tanstack/react-query";
import { refreshToken } from "@/services/authService";

// accessToken을 관리할 키
export const ACCESS_TOKEN_KEY = 'access-token';

// 토큰의 신선도를 체크하기 위한 타임스탬프 키
const TOKEN_TIMESTAMP_KEY = 'token-timestamp';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10분
    },
  },
});

// accessToken 관련 유틸리티 함수들
export const tokenUtils = {
  // access token 가져오기
  getToken: () => {
    // 개발 중 임시로 localStorage 사용
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    const timestamp = Number(localStorage.getItem(TOKEN_TIMESTAMP_KEY));
    const currentTime = Date.now();
    
    // 토큰이 있고 10분 이내에 발급된 경우 신선한 상태로 간주
    if (token && timestamp && (currentTime - timestamp) < 1000 * 60 * 10) {
      return token;
    }
    
    // 토큰이 없거나 10분이 지난 경우 null 반환
    return null;

    // 원래 코드 (인메모리 방식)
    /*
    const token = queryClient.getQueryData<string | null>([ACCESS_TOKEN_KEY]);
    const timestamp = queryClient.getQueryData<number | null>([TOKEN_TIMESTAMP_KEY]);
    const currentTime = Date.now();
    
    if (token && timestamp && (currentTime - timestamp) < 1000 * 60 * 10) {
      return token;
    }
    
    return null;
    */
  },

  // access token 설정
  setToken: (token: string) => {
    // 개발 중 임시로 localStorage 사용
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    localStorage.setItem(TOKEN_TIMESTAMP_KEY, Date.now().toString());

    // 원래 코드 (인메모리 방식)
    /*
    queryClient.setQueryData([ACCESS_TOKEN_KEY], token);
    queryClient.setQueryData([TOKEN_TIMESTAMP_KEY], Date.now());
    */
  },

  // access token 제거
  removeToken: () => {
    // 개발 중 임시로 localStorage 사용
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(TOKEN_TIMESTAMP_KEY);

    // 원래 코드 (인메모리 방식)
    /*
    queryClient.setQueryData([ACCESS_TOKEN_KEY], null);
    queryClient.setQueryData([TOKEN_TIMESTAMP_KEY], null);
    */
  },

  // refresh token으로 access token 갱신 시도
  tryRefreshToken: async () => {
    try {
      const response = await refreshToken();
      tokenUtils.setToken(response.accessToken);
      return true;
    } catch (error) {
      console.error('refreshToken 재발급 실패:', error);
      tokenUtils.removeToken();
      return false;
    }
  },
};
