import kakaoLogo from "@/assets/loginImages/kakao-logo.png";
import naverLogo from "@/assets/loginImages/naver-logo.png";
import googleLogo from "@/assets/loginImages/google-logo.png";
import logo from "@/assets/loginImages/기본빵.png";

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
        <button 
          className="flex w-96 h-12 px-6 justify-center items-center gap-2.5 bg-[#FEE500] text-black text-lg rounded-lg"
        >
          <div className="w-24 flex justify-end">
            <img src={kakaoLogo} alt="카카오 로고" className="w-10 h-10" />
          </div>
          <span className="w-28 text-center ml-4 font-bold">카카오 로그인</span>
          <div className="w-20"></div>
        </button>
        
        <button 
          className="flex w-96 h-12 px-6 justify-center items-center gap-2.5 bg-[#03C75A] text-white text-lg rounded-lg"
        >
          <div className="w-24 flex justify-end">
            <img src={naverLogo} alt="네이버 로고" className="w-10 h-10" />
          </div>
          <span className="w-28  text-center ml-4 font-bold">네이버 로그인</span>
          <div className="w-20"></div>
        </button>

        <button 
          className="flex w-96 h-12 px-6 justify-center items-center gap-2.5 bg-[#F2F2F2] text-neutral-500 text-lg rounded-lg"
        >
          <div className="w-24 flex justify-end">
            <img src={googleLogo} alt="구글 로고" className="w-10 h-10" />
          </div>
          <span className="w-28 text-center ml-4 font-bold">구글 로그인</span>
          <div className="w-20"></div>
        </button>
      </div>
      
      <p className="mt-6 text-sm text-neutral-500">
        © 2025, Remembread. All rights reserved.
      </p>
    </div>
  );
};

export default LoginPage;
