import CharacterImage from "@/components/common/CharacterImage";
import Game from "@/components/svgs/footer/Game";
import useProfileStore from "@/stores/profileStore";
import { handleAllowNotification } from "@/lib/firebase/tokenFCM";
import { useState } from "react";

const gameHistoryData = [
  {
    date: "2025년 04월 22일",
    score: 80,
  },
  // {
  //   date: "2025년 04월 22일",
  //   score: 80,
  // },
  // {
  //   date: "2025년 04월 22일",
  //   score: 80,
  // },
  // {
  //   date: "2025년 04월 22일",
  //   score: 80,
  // },
  // {
  //   date: "2025년 04월 22일",
  //   score: 80,
  // },
  // {
  //   date: "2025년 04월 22일",
  //   score: 80,
  // },
  // {
  //   date: "2025년 04월 22일",
  //   score: 80,
  // },
  // {
  //   date: "2025년 04월 22일",
  //   score: 80,
  // },
  // {
  //   date: "2025년 04월 22일",
  //   score: 80,
  // },
  // {
  //   date: "2025년 04월 22일",
  //   score: 80,
  // },
  // {
  //   date: "2025년 04월 22일",
  //   score: 80,
  // },
  // {
  //   date: "2025년 04월 22일",
  //   score: 80,
  // },
  // {
  //   date: "2025년 04월 22일",
  //   score: 80,
  // },
];

const GameHistory = () => {
  const { nickname, mainCharacterId, mainCharacterImageUrl } = useProfileStore();
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async () => {
    try {
      const token = await handleAllowNotification();
      if (token) {
        setIsSubscribed(true);
        // TODO: 서버에 토큰 전송 로직 추가 필요
        alert("알림 구독이 완료되었습니다!");
      } else {
        alert("알림 권한을 허용해주세요!");
      }
    } catch (error) {
      console.error("알림 구독 중 오류 발생:", error);
      alert("알림 구독 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center w-full webkit-scrollbar-hide">
      {/* 프로필 영역 */}
      <div className="flex flex-col items-center mt-4 mb-6">
        <CharacterImage characterId={mainCharacterId} characterImageUrl={mainCharacterImageUrl} className="w-24 h-24 mb-2" />
        <div className="text-lg font-bold mb-2">{nickname}</div>
        <div className="w-full h-1.5 bg-primary-300 mb-2" />
        <button
          onClick={handleSubscribe}
          className={`mt-2 px-4 py-2 rounded-full text-sm font-medium ${
            isSubscribed
              ? "bg-neutral-200 text-neutral-500"
              : "bg-primary-500 text-white hover:bg-primary-600"
          }`}
          disabled={isSubscribed}
        >
          {isSubscribed ? "알림 구독 완료" : "게임 알림 받기"}
        </button>
      </div>
      {/* 게임 히스토리 리스트 */}
      <div className="w-full px-4">
        {/* {gameHistoryData.map((item, idx) => (
          <div key={idx} className="flex items-center py-3 border-t-2 border-primary-300 last:border-b-0">
            <Game className="w-10 h-10 mr-4" />
            <div className="flex-1">
              <div className="text-xs text-neutral-400 mb-1">{item.date}</div>
              <div className="text-base font-semibold">
                게임 성적 <span className="font-bold">{item.score}/100</span>
              </div>
            </div>
          </div>
        ))} */}
        {gameHistoryData.length < 2 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-neutral-400">
            <Game className="w-12 h-12 mb-4 opacity-30" />
            <p className="text-sm font-medium">게임 기록이 없습니다</p>
            <p className="text-xs mt-1">학습을 완료하고 게임을 시작해보세요!</p>
          </div>
        ) : (
          gameHistoryData.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center py-3 border-t-2 border-primary-300 last:border-b-0"
            >
              <Game className="w-10 h-10 mr-4" />
              <div className="flex-1">
                <div className="text-xs text-neutral-400 mb-1">{item.date}</div>
                <div className="text-base font-semibold">
                  게임 성적 <span className="font-bold">{item.score}/100</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GameHistory;
