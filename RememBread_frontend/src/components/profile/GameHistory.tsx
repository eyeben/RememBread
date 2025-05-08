import CharacterImage from "@/components/common/CharacterImage";
import Game from "@/components/svgs/footer/Game";
import useProfileStore from "@/stores/profileStore";

const gameHistoryData = [
  {
    date: "2025년 04월 22일",
    score: 80,
  },
  {
    date: "2025년 04월 22일",
    score: 80,
  },
  {
    date: "2025년 04월 22일",
    score: 80,
  },
  {
    date: "2025년 04월 22일",
    score: 80,
  },
  {
    date: "2025년 04월 22일",
    score: 80,
  },
  {
    date: "2025년 04월 22일",
    score: 80,
  },
  {
    date: "2025년 04월 22일",
    score: 80,
  },
  {
    date: "2025년 04월 22일",
    score: 80,
  },  {
    date: "2025년 04월 22일",
    score: 80,
  },  {
    date: "2025년 04월 22일",
    score: 80,
  },  {
    date: "2025년 04월 22일",
    score: 80,
  },
  {
    date: "2025년 04월 22일",
    score: 80,
  },  {
    date: "2025년 04월 22일",
    score: 80,
  },  {
    date: "2025년 04월 22일",
    score: 80,
  },
];

const GameHistory = () => {
  const { nickname, mainCharacterId } = useProfileStore();

  return (
    <div className="flex flex-col items-center w-full webkit-scrollbar-hide">
      {/* 프로필 영역 */}
      <div className="flex flex-col items-center mt-4 mb-6">
        <CharacterImage characterId={mainCharacterId} className="w-24 h-24 mb-2" />
        <div className="text-lg font-bold mb-2">{nickname}</div>
        <div className="w-full h-1.5 bg-primary-300 mb-2" />
      </div>
      {/* 게임 히스토리 리스트 */}
      <div className="w-full px-4">
        {gameHistoryData.map((item, idx) => (
          <div key={idx} className="flex items-center py-3 border-t-2 border-primary-300 last:border-b-0">
            <Game className="w-10 h-10 mr-4" />
            <div className="flex-1">
              <div className="text-xs text-neutral-400 mb-1">{item.date}</div>
              <div className="text-base font-semibold">
                게임 성적 <span className="font-bold">{item.score}/100</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameHistory; 