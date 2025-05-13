import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import DefaultBread from "@/components/svgs/breads/DefaultBread";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // '/card-view/숫자' 형태의 경로에만 표시
  const showBackButton = /^\/card-view\/\d+(\/.*)?$/.test(location.pathname);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full max-w-[600px] h-14 mx-auto bg-white pc:border-x border-b border-neutral-200 z-50 pt-[env(safe-area-inset-top)]">
      <nav className="h-full mx-auto">
        <ul className="flex justify-between items-center w-full h-full px-5 relative">
          {/* 왼쪽 뒤로가기 버튼 (조건부 렌더링) */}
          {showBackButton && (
            <li className="flex items-center">
              <button onClick={handleBack} className="p-1">
                <ChevronLeft size={20} />
              </button>
            </li>
          )}

          {/* 가운데 로고 */}
          <li className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
            <Link to={"/card-view"}>
              <DefaultBread />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
