import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import DefaultBread from "@/components/svgs/breads/DefaultBread";
import Setting from "@/components/svgs/header/Setting";

const Header = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
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
                <Setting className="w-6 h-6" />
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Header;
