import axios from 'axios';

interface SocialLoginParams {
  code: string;
  socialType: string;
}

interface SocialLoginResponse {
  accessToken: string;
  isNewUser: boolean;
}

export const socialLogin = async ({ code, socialType }: SocialLoginParams): Promise<SocialLoginResponse> => {
  const response = await axios.post<SocialLoginResponse>(`/api/auth/${socialType}/callback`, { code });
  return response.data;
}; 