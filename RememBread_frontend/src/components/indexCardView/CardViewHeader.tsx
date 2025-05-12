interface CardViewHeaderProps {
  selectedTab: number;
  setSelectedTab: (index: number) => void;
}

const CardViewHeader = ({ selectedTab, setSelectedTab }: CardViewHeaderProps) => {
  const tabs = ["나의 카드", "카드 둘러보기"];

  return (
    <div className="relative w-full pc:h-16 h-12 px-4">
      <div className="flex justify-center items-center w-full h-full">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`w-1/2 text-center cursor-pointer pc:text-2xl text-xl ${
              selectedTab === index ? "font-bold text-primary-500" : "text-neutral-400"
            }`}
            onClick={() => setSelectedTab(index)}
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
