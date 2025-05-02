import { useState, ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, updateUser } from "@/services/userService";
import { logout } from "@/services/authService";
import { tokenUtils } from "@/lib/queryClient";
import Button from "@/components/common/Button";
import DefaultBread from "@/components/svgs/breads/DefaultBread";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const Profile = () => {
  const navigate = useNavigate();
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [pushEnable, setPushEnable] = useState<boolean>(false);
  const [mainCharacterId, setMainCharacterId] = useState<number>(1);

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
      console.log("수정할 데이터", name, pushEnable, mainCharacterId);
      await updateUser({
        nickname: name,
        pushEnable: pushEnable,
        mainCharacterId: mainCharacterId
      });
      setIsEditable(false);
    } catch (error) {
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

  return (
    <div
      className="flex flex-col justify-between items-center"
      style={{ minHeight: "calc(100vh - 200px)" }}
    >
      <div className="flex flex-col items-center">
        {mainCharacterId !== 1 ? (
          <img src={`/images/breads/InputBread.png`} alt="프로필 캐릭터" className="w-60 h-60" />
        ) : (
          <DefaultBread className="w-60 h-60" />
        )}
        {isEditable && (
          <Button className="w-1/2" variant="primary-outline">
            변경하기
          </Button>
        )}
      </div>
      <div className="flex flex-col items-center w-full gap-5">
        <Input
          className="w-1/2"
          type="text"
          value={name}
          disabled={!isEditable}
          onChange={handleNameChange}
        ></Input>
        <div className="flex w-1/2 justify-between">
          <div>위치 알람 설정</div>
          <Switch 
            checked={pushEnable} 
            onCheckedChange={handlePushEnableChange}
            disabled={!isEditable} 
          />
        </div>
      </div>

      {isEditable ? (
        <Button className="w-1/2" variant="primary" onClick={handleCompleteClick}>
          완료
        </Button>
      ) : (
        <Button className="w-1/2" variant="primary" onClick={handleEditClick}>
          수정하기
        </Button>
      )}

      <a 
        className="text-lg text-red-500 mb-6 underline cursor-pointer" 
        onClick={handleLogout}
      >
        로그아웃
      </a>
    </div>
  );
};

export default Profile;
