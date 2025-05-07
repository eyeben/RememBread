import { useState, ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, updateUser, deleteUser } from "@/services/userService";
import { logout } from "@/services/authService";
import { tokenUtils } from "@/lib/queryClient";
import Button from "@/components/common/Button";
import CharacterImage from "@/components/common/CharacterImage";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import ImageEditModal from "@/components/profile/ImageEditModal";

const Profile = () => {
  const navigate = useNavigate();
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [pushEnable, setPushEnable] = useState<boolean>(false);
  const [mainCharacterId, setMainCharacterId] = useState<number>(1);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUser();
        setName(userData.result.nickname);
        setPushEnable(userData.result.pushEnable);
        setMainCharacterId(userData.result.mainCharacterId);
      } catch (error) {
        console.error("유저 정보를 불러오는 중 오류가 발생했습니다:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleCompleteClick = async () => {
    try {
      await updateUser({
        nickname: name,
        pushEnable: pushEnable,
        mainCharacterId: mainCharacterId
      });
      setIsEditable(false);
    } catch (error) {
      console.log("error", error);
      console.error("유저 정보 수정 중 오류가 발생했습니다:", error);
    }
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handlePushEnableChange = (checked: boolean) => {
    setPushEnable(checked);
  };

  const handleLogout = async () => {
    try {
      await logout();
      tokenUtils.removeToken();
      navigate('/login');
    } catch (error) {
      console.error('로그아웃 중 오류가 발생했습니다:', error);
      // 에러가 발생하더라도 로컬의 토큰은 삭제하고 로그인 페이지로 이동
      tokenUtils.removeToken();
      navigate('/login');
    }
  };

  const handleWithdrawal = async () => {
    try {
      await deleteUser();
      tokenUtils.removeToken();
      navigate('/login');
    } catch (error) {
      console.error('회원탈퇴 중 오류가 발생했습니다:', error);
    }
  };

  const handleImageEdit = () => {
    setIsImageModalOpen(true);
  };

  const handleCharacterSelect = (characterId: number) => {
    setMainCharacterId(characterId);
    setIsImageModalOpen(false);
  };

  return (
    <div className="flex flex-col justify-between items-center min-h-[calc(100vh-200px)] px-4 sm:px-6 md:px-8">
      <div className="flex flex-col items-center w-full max-w-md mx-auto">
        <CharacterImage characterId={mainCharacterId} />
        <div className="h-10 mt-4 w-full flex justify-center">
          {isEditable && (
            <Button className="min-w-48 w-full max-w-72 h-10" variant="primary-outline" onClick={handleImageEdit}>
              변경하기
            </Button>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center w-full max-w-md mx-auto gap-5 mt-8">
        <div className="flex w-full justify-between items-center">
          <Input
            className="min-w-48 w-full max-w-72 h-10 mx-auto"
            type="text"
            value={name}
            disabled={!isEditable}
            onChange={handleNameChange}
          />
        </div>
        <div className="flex w-full justify-center items-center">
          <div className="flex min-w-48 w-full max-w-72 justify-between items-center">
            <div>위치 알람 설정</div>
            <Switch 
              checked={pushEnable} 
              onCheckedChange={handlePushEnableChange}
              disabled={!isEditable} 
            />
          </div>
        </div>
        <div className="w-full flex justify-center">
          {isEditable ? (
            <Button className="min-w-48 w-full max-w-72 h-10" variant="primary" onClick={handleCompleteClick}>
              완료
            </Button>
          ) : (
            <Button className="min-w-48 w-full max-w-72 h-10" variant="primary" onClick={handleEditClick}>
              수정하기
            </Button>
          )}
        </div>
      </div>

      <a 
        className="text-lg text-red-500 mb-6 underline cursor-pointer mt-4" 
        onClick={isEditable ? handleWithdrawal : handleLogout}
      >
        {isEditable ? '회원탈퇴' : '로그아웃'}
      </a>

      <ImageEditModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onSelect={handleCharacterSelect}
        currentCharacterId={mainCharacterId}
      />
    </div>
  );
};

export default Profile;
