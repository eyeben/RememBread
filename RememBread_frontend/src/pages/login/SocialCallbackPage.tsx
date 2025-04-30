import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { socialLogin } from '@/services/authService';
import useAuthStore from '@/stores/authStore';

const SocialCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const code = searchParams.get('code');
  const socialType = window.location.pathname.split('/')[3]; // /account/login/kakao 등에서 kakao 추출

  useEffect(() => {
    const handleSocialLogin = async () => {
      if (!code || !socialType) return;

      try {
        const response = await socialLogin({ code, socialType });
        // 신규 사용자인 경우 약관 동의 페이지로 이동
        if (response.result.isNew) {
          navigate('/signup/terms');
        } else {
          // 기존 사용자인 경우 로그인 처리
          setAuth(response.result.accessToken);
          navigate('/');
        }
      } catch (error) {
        // 에러 발생 시 로그인 페이지로 이동
        navigate('/login', {
          state: {
            message: '로그인에 실패했습니다. 다시 시도해주세요.',
            socialType,
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    handleSocialLogin();
  }, [code, socialType, navigate, setAuth]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-lg">로그인 처리 중...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default SocialCallbackPage; 