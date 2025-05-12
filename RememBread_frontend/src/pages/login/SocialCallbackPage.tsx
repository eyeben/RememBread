import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { socialLogin } from '@/services/authService';
import { tokenUtils } from '@/lib/queryClient';

const SocialCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const code = searchParams.get('code');
  const socialType = window.location.pathname.split('/')[3]; // /account/login/kakao 등에서 kakao 추출
  const redirectUri = window.location.origin + window.location.pathname;

  const isLoginAttempted = useRef(false);

  useEffect(() => {
    const handleSocialLogin = async () => {
      if (isLoginAttempted.current) return;
      isLoginAttempted.current = true;

      if (!code || !socialType) {
        setError('로그인 정보가 올바르지 않습니다.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await socialLogin({ code, socialType, redirectUri });
        
        // access token을 인메모리에 저장
        tokenUtils.setToken(response.result.accessToken);
        
        // 약관 동의하지 않은 사용자는 약관 동의 페이지로 이동
        if (!response.result.isAgreedTerms) {
          navigate('/signup/terms');
        } else {
          // 약관 동의한 사용자는 로그인 처리
          navigate('/card-view/my');
        }
      } catch (error) {
        setError('로그인에 실패했습니다. 다시 시도해주세요.');
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
  }, []); // 의존성 배열을 비워서 마운트 시 한 번만 실행되도록 함

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen no-scrollbar">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-lg">로그인 처리 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen no-scrollbar">
        <div className="text-center">
          <p className="text-lg text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return null;
};

export default SocialCallbackPage; 