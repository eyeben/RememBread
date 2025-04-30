import { QueryClient } from "@tanstack/react-query";

// accessToken을 관리할 키
export const ACCESS_TOKEN_KEY = 'access-token';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10,
    },
  },
});

// accessToken 관련 유틸리티 함수들
export const tokenUtils = {
  getToken: () => queryClient.getQueryData<string | null>([ACCESS_TOKEN_KEY]),
  setToken: (token: string) => queryClient.setQueryData([ACCESS_TOKEN_KEY], token),
  removeToken: () => queryClient.setQueryData([ACCESS_TOKEN_KEY], null),
};
