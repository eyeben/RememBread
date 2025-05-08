import { useEffect, useState  } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "@/services/userService";
import CharacterImage from "@/components/common/CharacterImage";
import StudyBarChart from "@/components/profile/StudyBarChart";

interface profile{
  nickname: string;
  mainCharacterId: number;
}

const StudyHistory = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<profile| null>(null);
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
      <StudyBarChart />
    </div>
  );
};

export default StudyHistory; 