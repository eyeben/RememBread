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
    const token = queryClient.getQueryData<string | null>([ACCESS_TOKEN_KEY]);
    const timestamp = queryClient.getQueryData<number | null>([TOKEN_TIMESTAMP_KEY]);
    const currentTime = Date.now();
    
    if (token && timestamp && (currentTime - timestamp) < 1000 * 60 * 10) {
      return token;
    }
    
    return null;
  },

  // access token 설정
  setToken: (token: string) => {
    queryClient.setQueryData([ACCESS_TOKEN_KEY], token);
    queryClient.setQueryData([TOKEN_TIMESTAMP_KEY], Date.now());
  },

  // access token 제거
  removeToken: () => {
    queryClient.setQueryData([ACCESS_TOKEN_KEY], null);
    queryClient.setQueryData([TOKEN_TIMESTAMP_KEY], null);
  },

  // refresh token으로 access token 갱신 시도
  tryRefreshToken: async () => {
    try {
      console.log('📤 백엔드로 refresh token 요청 전송 중...');
      const response = await refreshToken();
      console.log('📥 백엔드로부터 새로운 accessToken 수신 성공');
      tokenUtils.setToken(response.accessToken);
      return true;
    } catch (error) {
      console.error('❌ accessToken 재발급 실패:', error);
      tokenUtils.removeToken();
      return false;
    }
  },
};
