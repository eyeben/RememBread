import { useState, ChangeEvent } from "react";
import Button from "@/components/common/Button";
import DefaultBread from "@/components/svgs/breads/DefaultBread";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const Profile = () => {
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [name, setName] = useState<string>("원서");

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleCompleteClick = () => {
    setIsEditable(false);
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return (
    <div
      className="flex flex-col justify-between items-center"
      style={{ minHeight: "calc(100vh - 200px)" }}
    >
      <div className="flex flex-col items-center">
        <DefaultBread className="w-60 h-60" />
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
          <Switch disabled={!isEditable} />
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
