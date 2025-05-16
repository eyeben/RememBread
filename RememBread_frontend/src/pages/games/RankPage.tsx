import { useState } from "react";

const tabs = ["순간기억", "가격비교", "그림자빵", "빵 탐정"];

const RankPage = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  return (
    <>
      <div className="relative h-full flex gap-1 border-b my-2">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`flex-1 p-2 text-center cursor-pointer ${
              selectedTab === index ? "font-bold text-primary-500" : "text-neutral-500"
            }`}
            onClick={() => setSelectedTab(index)}
          >
            {tab}
          </div>
        ))}

        <div
          className="absolute bottom-0 h-1 bg-primary-500 transition-all duration-300"
          style={{ width: "25%", left: `${selectedTab * 25}%` }}
        />
      </div>

      <div></div>
    </>
  );
};

export default RankPage;
