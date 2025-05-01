import { useState, ChangeEvent, useEffect } from "react";
import Button from "@/components/common/Button";
import DefaultBread from "@/components/svgs/breads/DefaultBread";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { getUser } from "@/services/userService";

const Profile = () => {
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [pushEnable, setPushEnable] = useState<boolean>(false);
  const [mainCharacterImageUrl, setMainCharacterImageUrl] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUser();
        setName(userData.result.nickname);
        setPushEnable(userData.result.pushEnable);
        setMainCharacterImageUrl(userData.result.mainCharacterImageUrl);
      } catch (error) {
        console.error("유저 정보를 불러오는 중 오류가 발생했습니다:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleCompleteClick = () => {
    setIsEditable(false);
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handlePushEnableChange = (checked: boolean) => {
    setPushEnable(checked);
  };

  return (
    <div
      className="flex flex-col justify-between items-center"
      style={{ minHeight: "calc(100vh - 200px)" }}
    >
      <div className="flex flex-col items-center">
        {mainCharacterImageUrl ? (
          <img src={mainCharacterImageUrl} alt="프로필 캐릭터" className="w-60 h-60" />
        ) : (
          <DefaultBread className="w-60 h-60" />
        )}
        <Button className="w-1/2" variant="primary-outline">
          변경하기
        </Button>
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

      <a className="text-sm text-neutral-400">로그아웃</a>
    </div>
  );
};

export default Profile;
