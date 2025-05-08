import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "@/services/userService";
import CharacterImage from "@/components/common/CharacterImage";
import Game from "@/components/svgs/footer/Game";

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

interface profile{
  nickname: string;
  mainCharacterId: number;
}

const GameHistory = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUser();
        setProfile({
          nickname: data.result.nickname,
          mainCharacterId: data.result.mainCharacterId,
        });
        setLoading(false);
      } catch (error) {
        console.error("유저 정보를 불러오는 중 오류가 발생했습니다:", error);
        navigate("/login")
      }
    };
    fetchUserData();
  }, []);

  if (loading) {
    return <div className="w-full text-center py-8">프로필 정보를 불러오는 중...</div>;
  }

  return (
    <div className="flex flex-col items-center w-full webkit-scrollbar-hide">
      {/* 프로필 영역 */}
      <div className="flex flex-col items-center mt-4 mb-6">
        <CharacterImage characterId={profile!.mainCharacterId} className="w-24 h-24 mb-2" />
        <div className="text-lg font-bold mb-2">{profile?.nickname}</div>
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