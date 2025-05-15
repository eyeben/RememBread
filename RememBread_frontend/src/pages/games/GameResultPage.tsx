import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useGameStore from "@/stores/gameStore";
import useProfileStore from "@/stores/profileStore";
import ClearBread from "@/components/svgs/breads/ClearBread";
import DefaultBread from "@/components/svgs/breads/DefaultBread";
import { getUser } from "@/services/userService";

interface LeaderboardEntry {
  id: number;
  name: string;
  score: number;
}

// 임시 더미 데이터
const dummyLeaderboard: LeaderboardEntry[] = [
  { id: 1, name: "김민수", score: 8 },
  { id: 2, name: "이지은", score: 5 },
  { id: 3, name: "박준호", score: 4 },
  { id: 4, name: "최영희", score: 3 },
  { id: 5, name: "정태훈", score: 2 }
];

const GameResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { memoryScore, compareScore, detectiveScore, shadowScore, resetMemoryScore, resetCompareScore, resetDetectiveScore, resetShadowScore } = useGameStore();
  const { nickname, mainCharacterImageUrl, setProfile } = useProfileStore();
  const [userProfile, setUserProfile] = useState<{ nickname: string, profileImage: string }>({ nickname: '', profileImage: '' });
  
  const gameType = location.state?.game || "memory";
  const score = gameType === "memory" ? memoryScore : 
                gameType === "compare" ? compareScore : 
                gameType === "detective" ? detectiveScore :
                shadowScore;

  useEffect(() => {
    const fetchUserProfile = async () => {
      // 스토어에 프로필 정보가 있는지 확인
      if (nickname && mainCharacterImageUrl) {
        setUserProfile({
          nickname: nickname,
          profileImage: mainCharacterImageUrl
        });
      } else {
        try {
          const response = await getUser();
            setUserProfile({
              nickname: response.result.nickname,
              profileImage: response.result.mainCharacterImageUrl
          })
          setProfile(response.result)

        } catch (error) {
          console.error('프로필 정보를 가져오는데 실패했습니다:', error);
        }
      }
    };

    fetchUserProfile();
  }, [nickname, mainCharacterImageUrl]);

  // 현재 사용자의 순위 계산
  const userRank = dummyLeaderboard.findIndex(item => item.name === userProfile.nickname);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <header>
        <div className="flex justify-center mb-2">
          <ClearBread className="w-16 h-16" />
        </div>
        <span className="flex text-2xl font-bold mb-4 justify-center">
          {gameType === "memory" ? "순간기억" : 
          gameType === "compare" ? "가격비교" : 
          gameType === "detective" ? "빵 탐정" :
          "그림자빵"}
        </span>
      </header>

      <div className="w-full max-w-md bg-white rounded-lg border-2 border-primary-200 p-6 mb-8">
        {/* 현재 사용자 점수 */}
        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg mb-6">
          <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
            {userProfile.profileImage ? (
              <img 
                src={userProfile.profileImage} 
                alt="User" 
                className="w-full h-full object-cover" 
              />
            ) : (
              <DefaultBread className="w-full h-full" />
            )}
          </div>
          <div className="flex-1">
            <div className="text-lg font-bold">{userRank !== -1 ? `${userRank + 1}등` : '-'}</div>
            <div className="text-gray-600">{score} Pts</div>
          </div>
        </div>

        {/* 리더보드 */}
        <div>
          <h3 className="text-xl font-bold mb-4">리더보드</h3>
          <div className="space-y-2 h-[200px] sm:h-[270px] overflow-y-auto pr-2">
            {dummyLeaderboard.map((player, index) => (
              <div 
                key={player.id} 
                className={`flex items-center gap-4 p-3 rounded-lg ${
                  player.name === userProfile.nickname ? 'bg-gray-200' : 'hover:bg-gray-50'
                }`}
              >
                <div className="w-8 text-center font-bold">{index + 1}</div>
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                  <DefaultBread className="w-full h-full" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{player.name}</div>
                </div>
                <div className="font-bold text-primary-500">{player.score}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-grid gap-4 w-full max-w-md">
        <button
          onClick={() => {
            if (gameType === "memory") {
              resetMemoryScore();
              navigate("/games/memory");
            } else if (gameType === "compare") {
              resetCompareScore();
              navigate("/games/compare");
            } else if (gameType === "detective") {
              resetDetectiveScore();
              navigate("/games/detective");
            } else if (gameType === "shadow") {
              resetShadowScore();
              navigate("/games/shadow");
            }
          }}
          className="w-full px-6 py-2 bg-primary-500 font-bold text-white rounded-lg hover:bg-primary-600"
        >
          다시하기
        </button>
        <button
          onClick={() => {
            resetMemoryScore();
            resetCompareScore();
            resetDetectiveScore();
            resetShadowScore();
            navigate("/games");
          }}
          className="w-full px-6 py-2 bg-neutral-200 text-neutral-700 font-bold rounded-lg hover:bg-neutral-300"
        >
          게임 목록으로
        </button>
      </div>
    </div>
  );
};

export default GameResultPage; 