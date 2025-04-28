import kakaoLogo from "@/assets/loginImages/kakao-logo.png";
import naverLogo from "@/assets/loginImages/naver-logo.png";
import googleLogo from "@/assets/loginImages/google-logo.png";
import logo from "@/assets/loginImages/기본빵.png";
import SocialLoginButton from "@/components/common/SocialLoginButton";

const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center mb-20">
        <h1 className="text-2xl font-bold mb-4">"출근길에 굽는 지식 한 조각"</h1>
        <img src={logo} alt="로고" className="w-[200px] h-[200px] mx-auto" />
      </div>
      <div className="text-center mb-2 text-neutral-500">
        <p>sns 계정으로 간편하게 로그인 하세요</p>
      </div>
      
      <div className="flex flex-col items-center gap-4">
        <SocialLoginButton 
          bgColor="bg-[#FEE500]"
          logoSrc={kakaoLogo}
          text="카카오 로그인"
        />
        
        <SocialLoginButton 
          bgColor="bg-[#03C75A]"
          textColor="text-white"
          logoSrc={naverLogo}
          text="네이버 로그인"
        />
        
        <SocialLoginButton 
          bgColor="bg-[#F2F2F2]"
          textColor="text-neutral-500"
          logoSrc={googleLogo}
          text="구글 로그인"
        />
      </div>
      
      <p className="mt-6 text-sm text-neutral-500">
        © 2025, Remembread. All rights reserved.
      </p>
    </div>
  );
};

export default LoginPage;
