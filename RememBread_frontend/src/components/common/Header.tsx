import { Link } from "react-router-dom";
import DefaultBread from "@/components/svgs/breads/DefaultBread";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 w-full max-w-[600px] h-14 mx-auto bg-white pc:border-x border-b border-neutral-200 z-50">
      <nav className="h-full mx-auto">
        <ul className="flex justify-between items-center w-full h-full px-5">
          <li className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
            <Link to={"/"}>
              <DefaultBread />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
