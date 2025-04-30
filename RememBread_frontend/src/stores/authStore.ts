import { create } from 'zustand';
import { refreshToken } from '@/services/authService';
import { tokenUtils } from '@/lib/queryClient';

interface AuthState {
  checkAndRefreshToken: () => Promise<boolean>;
}
/** 
 * 토큰 관리 스토어 
 * 
 * accessToken 저장 및 관리
 * 
 * refreshToken 재발급 시도
 */
const useAuthStore = create<AuthState>(() => ({
  // accessToken이 없고 refresh token이 있는 경우에만 재발급 시도
  checkAndRefreshToken: async () => {
    try {
      const response = await refreshToken();
      tokenUtils.setToken(response.accessToken);
      return true;
    } catch (error) {
      tokenUtils.removeToken();
      return false;
    }
  },
}));

export default useAuthStore; 