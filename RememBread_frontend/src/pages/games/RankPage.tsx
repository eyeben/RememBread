import { useEffect, useState } from "react";
import { getRanks } from "@/services/gameService";
import { LeaderboardType } from "@/types/game";
import DefaultBread from "@/components/svgs/breads/DefaultBread";

const tabs = ["순간기억", "가격비교", "그림자빵", "빵 탐정"];

const RankPage = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [Leaderboard, setLeaderboard] = useState<LeaderboardType[]>([]);

  const gameTypes = ["MEMORY", "COMPARE", "SHADOW", "DETECTIVE"];

  useEffect(() => {
    const getLeaderboard = async () => {
      try {
        const response = await getRanks(gameTypes[selectedTab]);
        console.log("게임 랭킹 조회 완료", response);
        setLeaderboard(response.result);
      } catch (error) {
        console.error("게임 랭킹 조회 중 오류 발생:", error);
      }
    };
    getLeaderboard();
  }, [selectedTab]);

  return (
    <>
      {/* 상단 부분 */}
      <header className="relative h-full flex gap-1 border-b my-2">
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
      </header>

      {/* 하단 부분 */}
      <main className="flex flex-col items-center">
        <div className="flex justify-center mb-4">
          <span className="text-xl font-bold">전체 랭킹</span>
        </div>
        <div className="w-full max-w-md mx-auto bg-white rounded-lg border-2 border-primary-200 p-6">
          <div className="space-y-2 overflow-y-auto pr-2">
            {Leaderboard.map((player, index) => (
              <div 
                key={index}
                className={`flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50`}
              >
                <div className="w-8 text-center font-bold">{player.rank}</div>
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                  {player.mainCharacterImageUrl ? (
                    <img 
                      src={player.mainCharacterImageUrl} 
                      alt="User" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <DefaultBread className="w-full h-full" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{player.nickname}</div>
                  <div className="text-xs text-neutral-400">{player.playedAt.split('T')[0]}</div>
                </div>
                <div className="font-bold text-primary-500">{player.maxScore}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default RankPage;
