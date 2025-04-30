import { create } from 'zustand';
import { refreshToken } from '@/services/authService';

interface AuthState {
  accessToken: string | null;
  setAuth: (token: string) => void;
  clearAuth: () => void;
  checkAndRefreshToken: () => Promise<boolean>;
}
/** 
 * 토큰 관리 스토어 
 * 
 * accessToken 저장 및 관리
 * 
 * refreshToken 재발급 시도
 */
const useAuthStore = create<AuthState>((set) => ({
  // accessToken
  accessToken: null,
  // 토큰 저장
  setAuth: (token) => set({ accessToken: token }),
  // 토큰 삭제
  clearAuth: () => set({ accessToken: null }),
  // accessToken이 없고 refresh token이 있는 경우에만 재발급 시도
  checkAndRefreshToken: async () => {
    try {
      const response = await refreshToken();
      set({ accessToken: response.accessToken });
      return true;
    } catch (error) {
      set({ accessToken: null });
      return false;
    }
  },
}));

export default useAuthStore; 