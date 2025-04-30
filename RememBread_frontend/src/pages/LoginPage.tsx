import Button from "@/components/common/Button";
import KakaoLogo from "@/components/svgs/login/KakaoLogo";
import NaverLogo from "@/components/svgs/login/NaverLogo";
import GoogleLogo from "@/components/svgs/login/GoogleLogo";
import DefaultBread from "@/components/svgs/breads/DefaultBread";

const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center mb-20">
        <h1 className="text-2xl font-bold mb-4">"출근길에 굽는 지식 한 조각"</h1>
        <DefaultBread className="w-[200px] h-[200px] mx-auto" />
      </div>
      <div className="text-center mb-2 text-neutral-500">
        <p>sns 계정으로 간편하게 로그인 하세요</p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <Button
          variant="shadow"
          className="w-96 h-12 px-6 flex justify-center items-center gap-2.5 bg-[#FEE500] hover:bg-[#E6CE00] text-black transition-colors"
        >
          <div className="w-24 flex justify-end">
            <KakaoLogo className="w-6 h-6" />
          </div>
          <span className="w-28 text-center ml-4 font-bold">카카오 로그인</span>
          <div className="w-20"></div>
        </Button>

        <Button
          variant="shadow"
          className="w-96 h-12 px-6 flex justify-center items-center gap-2.5 bg-[#03C75A] hover:bg-[#02B04E] text-white transition-colors"
        >
          <div className="w-24 flex justify-end">
            <NaverLogo className="w-6 h-6" />
          </div>
          <span className="w-28 text-center ml-4 font-bold">네이버 로그인</span>
          <div className="w-20"></div>
        </Button>

        <Button
          variant="shadow"
          className="w-96 h-12 px-6 flex justify-center items-center gap-2.5 bg-[#F2F2F2] hover:bg-[#E0E0E0] text-neutral-500 transition-colors"
        >
          <div className="w-24 flex justify-end">
            <GoogleLogo className="w-6 h-6" />
          </div>
          <span className="w-28 text-center ml-4 font-bold">구글 로그인</span>
          <div className="w-20"></div>
        </Button>
      </div>

      <p className="mt-6 text-sm text-neutral-500">© 2025, Remembread. All rights reserved.</p>
    </div>
  );
};

export default LoginPage;
