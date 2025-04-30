import axios from 'axios';
import useAuthStore from '@/stores/authStore';

interface SocialLoginParams {
  code: string;
  socialType: string;
}

interface SocialLoginResponse {
  accessToken: string;
  isNewUser: boolean;
}

interface RefreshTokenResponse {
  accessToken: string;
}

/** 
 * 소셜 로그인 
 * 
 * 소셜 로그인 요청 및 응답 처리
 * socialType : kakao, google, naver
 * code : 소셜 로그인 응답 코드
 */
export const socialLogin = async ({ code, socialType }: SocialLoginParams): Promise<SocialLoginResponse> => {
  try {
    const response = await axios.get<SocialLoginResponse>(`/auth/login/${socialType}`, { 
      params: { code } 
    });
    return response.data;
  } catch (error) {
    throw new Error('소셜 로그인에 실패했습니다.');
  }
};

/**
 * Access Token 재발급
 * 
 * Refresh Token을 기반으로 새로운 Access Token을 발급받음.
 * refresh-token은 쿠키로 전송
 */
export const refreshToken = async (): Promise<RefreshTokenResponse> => {
  try {
    const { accessToken } = useAuthStore.getState();
    const response = await axios.post<RefreshTokenResponse>('/auth/reissue', null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error('토큰 갱신에 실패했습니다.');
  }
}; 