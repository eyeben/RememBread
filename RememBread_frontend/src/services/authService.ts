import http from '@/services/httpCommon';
import { AUTH_END_POINT } from '@/services/endPoints';

interface SocialLoginParams {
  code: string;
  socialType: string;
}

interface SocialLoginResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    accessToken: string;
    isAgreedTerms: boolean;
    userId: string;
  };
}

interface RefreshTokenResponse {
  accessToken: string;
}

interface LogoutResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {}
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
    const response = await http.get<SocialLoginResponse>(
      AUTH_END_POINT.SOCIAL_LOGIN(socialType),
      { params: { code } }
    );
    return response.data;
  } catch (error) {
    console.error('소셜 로그인 실패:', error);
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
    const response = await http.post<RefreshTokenResponse>(AUTH_END_POINT.REFRESH_TOKEN);
    return response.data;
  } catch (error) {
    console.error('토큰 갱신에 실패했습니다:', error);
    throw new Error('토큰 갱신에 실패했습니다.');
  }
};

/**
 * 로그아웃
 * 
 * 로그아웃 요청 및 응답 처리
 */
export const logout = async (): Promise<LogoutResponse> => {
  try {
    const response = await http.post<LogoutResponse>(AUTH_END_POINT.LOGOUT);
    return response.data;
  } catch (error) {
    throw new Error('로그아웃에 실패했습니다.');
  }
};