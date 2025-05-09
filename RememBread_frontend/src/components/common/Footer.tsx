import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FooterModal from "@/components/footer/FooterModal";
import FooterItem from "@/components/footer/FooterItem";
import Game from "@/components/svgs/footer/Game";
import GameBlack from "@/components/svgs/footer/GameBlack";
import Map from "@/components/svgs/footer/Map";
import MapBlack from "@/components/svgs/footer/MapBlack";
import IndexCard from "@/components/svgs/footer/IndexCard";
import IndexCardBlack from "@/components/svgs/footer/IndexCardBlack";
import Profile from "@/components/svgs/footer/Profile";
import ProfileBlack from "@/components/svgs/footer/ProfileBlack";
import CreateOven from "@/components/svgs/footer/CreateOven";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOvenOpen, setIsOvenOpen] = useState<boolean>(false);

  const isActive = (path: string) => {
    if (path === "/card-view") {
      return location.pathname.startsWith("/card-view");
    }
    return location.pathname === path;
  };

  const handleOvenClick = () => {
    setIsOvenOpen(!isOvenOpen);
  };

  const handleCloseModal = () => {
    setIsOvenOpen(false);
  };

  const handleNavigate = (path: string) => {
    handleCloseModal();
    navigate(path);
  };

  return (
    <>
      <FooterModal isOpen={isOvenOpen} onClose={handleCloseModal} />
      <footer className="fixed flex justify-evenly bottom-0 left-0 right-0 w-full max-w-[600px] h-16 mx-auto bg-white pc:border-x border-t border-neutral-200 z-50">
        <FooterItem
          isActive={isActive("/card-view")}
          onClick={() => handleNavigate("/card-view/my")}
          activeIcon={<IndexCard className="w-10 h-10" />}
          inactiveIcon={<IndexCardBlack className="w-10 h-10" />}
          label="인덱스 카드"
        />
        <FooterItem
          isActive={isActive("/map")}
          onClick={() => handleNavigate("/map")}
          activeIcon={<Map className="w-10 h-10" />}
          inactiveIcon={<MapBlack className="w-10 h-10" />}
          label="빵길"
        />
        <div
          className="flex-1 flex flex-col items-center justify-center cursor-pointer"
          onClick={handleOvenClick}
        >
          <div className="relative w-[60px] h-[69px] flex items-center justify-center">
            <CreateOven className="absolute w-full h-full" />
          </div>
        </div>
        <FooterItem
          isActive={isActive("/games")}
          onClick={() => handleNavigate("/games")}
          activeIcon={<Game className="w-10 h-10" />}
          inactiveIcon={<GameBlack className="w-10 h-10" />}
          label="빵반죽"
        />
        <FooterItem
          isActive={isActive("/profile")}
          onClick={() => handleNavigate("/profile")}
          activeIcon={<Profile className="w-10 h-10" />}
          inactiveIcon={<ProfileBlack className="w-10 h-10" />}
          label="기본빵"
        />
      </footer>
    </>
  );
};

export default Footer;
