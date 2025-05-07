import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const tabs = ["나의 카드", "카드 둘러보기"];
const routes = ["/card-view/my", "/card-view/search"];

const CardViewHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedTab, setSelectedTab] = useState<number>(0);

  useEffect(() => {
    if (location.pathname.includes("search")) {
      setSelectedTab(1);
    } else {
      setSelectedTab(0);
    }
  }, [location.pathname]);

  const handleTabClick = (index: number) => {
    setSelectedTab(index);
    navigate(routes[index]);
  };

  return (
    <div className="relative w-full pc:h-12 h-10 px-4">
      <div className="flex justify-center items-center w-full h-full">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`w-1/2 text-center cursor-pointer text-2xl ${
              selectedTab === index ? "font-bold text-primary-500" : "text-neutral-400"
            }`}
            onClick={() => handleTabClick(index)}
          >
            {tab}
          </div>
        ))}
      </div>

      <div
        className="absolute bottom-0 h-1 bg-primary-500 transition-all duration-300"
        style={{ width: "50%", left: `${selectedTab * 50}%` }}
      />
    </div>
  );
};

export default CardViewHeader;
