import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import DefaultBread from "@/components/svgs/breads/DefaultBread";
import Setting from "@/components/svgs/header/Setting";
import SettingModal from "@/components/header/SettingModal";
import { useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const [isSettingModalOpen, setIsSettingModalOpen] = useState<boolean>(false);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    // 로그아웃 로직 구현
    // 예: localStorage에서 토큰 제거
    localStorage.removeItem("token");
    // 로그인 페이지로 이동
    navigate("/login");
    setIsSettingModalOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 w-full max-w-[600px] h-14 mx-auto bg-white pc:border-x border-b border-neutral-200 z-30">
        <nav className="h-full mx-auto">
          <ul className="flex justify-between items-center w-full h-full px-5">
            <li>
              <ChevronLeft 
                className="w-6 h-6 text-neutral-500 cursor-pointer" 
                onClick={handleGoBack}
              />
            </li>
            <li className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
              <Link to={"/"}>
                <DefaultBread />
              </Link>
            </li>
            <li>
              <button 
                onClick={() => setIsSettingModalOpen(true)}
                className="cursor-pointer"
              >
                <Setting className="w-6 h-6" />
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <SettingModal 
        isOpen={isSettingModalOpen}
        onClose={() => setIsSettingModalOpen(false)}
        onLogout={handleLogout}
      />
    </>
  );
};

export default Header;
