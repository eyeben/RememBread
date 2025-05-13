import { useState, ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, updateUser } from "@/services/userService";
import { logout } from "@/services/authService";
import { tokenUtils } from "@/lib/queryClient";
import Button from "@/components/common/Button";
import CharacterImage from "@/components/common/CharacterImage";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import ImageEditModal from "@/components/profile/ImageEditModal";
import TimePicker from "@/components/profile/TimePicker";
import useProfileStore from "@/stores/profileStore";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { SquarePen } from "lucide-react";

interface ApiError {
  response?: {
    data?: {
      code?: string;
    };
  };
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const [ampm, setAmpm] = useState<string>("오전");
  const [hour, setHour] = useState<string>("09");
  const [minute, setMinute] = useState<string>("00");
  const [isTimePickerOpen, setIsTimePickerOpen] = useState<boolean>(false);
  

  
  const { 
    nickname, 
    notificationTimeEnable, 
    notificationTime,
    mainCharacterId,
    mainCharacterImageUrl,
    setProfile,
    resetProfile 
  } = useProfileStore();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUser();
        
        // 시간 데이터 파싱
        const timeString = userData.result.notificationTime; // "HH:mm:00"
        const [hours, minutes] = timeString.split(':');
        const hour24 = parseInt(hours);
        
        // 오전/오후 및 12시간 형식으로 변환
        let hour12 = hour24;
        let ampmValue = "오전";
        
        if (hour24 >= 12) {
          ampmValue = "오후";
          hour12 = hour24 === 12 ? 12 : hour24 - 12;
        } else if (hour24 === 0) {
          ampmValue = "오후";
          hour12 = 12;

        }

        setAmpm(ampmValue);
        setHour(hour12.toString().padStart(2, '0'));
        setMinute(minutes);

        setProfile({
          nickname: userData.result.nickname,
          notificationTimeEnable: userData.result.notificationTimeEnable,
          notificationTime: userData.result.notificationTime,
          mainCharacterId: userData.result.mainCharacterId,
          mainCharacterImageUrl: userData.result.mainCharacterImageUrl,
          socialLoginType: userData.result.socialLoginType
        });
      } catch (error) {
        console.error("유저 정보를 불러오는 중 오류가 발생했습니다:", error);
        navigate("/login");
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
        nickname,
        notificationTimeEnable,
        notificationTime,
        mainCharacterId
      });
      setIsEditable(false);
    } catch (error) {
      if ((error as ApiError).response?.data?.code === "USER4001") {
        toast({
          variant: "error",
          title: "닉네임 중복",
          description: "이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해주세요.",
        });
      } else {
        console.error("유저 정보 수정 중 오류가 발생했습니다:", error);
        toast({
          variant: "error",
          title: "오류 발생",
          description: "유저 정보 수정 중 문제가 발생했습니다. 다시 시도해주세요.",
        });
      }
    }
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...useProfileStore.getState(),
      nickname: e.target.value
    });
  };

  const handlenotificationTimeEnableChange = (checked: boolean) => {
    setProfile({
      ...useProfileStore.getState(),
      notificationTimeEnable: checked
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      tokenUtils.removeToken();
      resetProfile();
      navigate('/login');
    } catch (error) {
      console.error('로그아웃 중 오류가 발생했습니다:', error);
      tokenUtils.removeToken();
      resetProfile();
      navigate('/login');
    }
  };

  // const handleWithdrawal = async () => {
  //   try {
  //     await deleteUser();
  //     tokenUtils.removeToken();
  //     resetProfile();
  //     navigate('/login');
  //   } catch (error) {
  //     console.error('회원탈퇴 중 오류가 발생했습니다:', error);
  //   }
  // };

  const handleImageEdit = () => {
    setIsImageModalOpen(true);
  };

  const handleCharacterSelect = (characterId: number, characterImageUrl: string) => {
    setProfile({
      ...useProfileStore.getState(),
      mainCharacterId: characterId,
      mainCharacterImageUrl: characterImageUrl
    });
    setIsImageModalOpen(false);
  };

  const handleTimeChange = (newAmpm: string, newHour: string, newMinute: string) => {
    setAmpm(newAmpm);
    setHour(newHour);
    setMinute(newMinute);

    // 24시간 형식으로 변환
    let hour24 = parseInt(newHour);
    if (newAmpm === "오후") {
      hour24 += 12;
      if (hour24 >= 24) {
        hour24 = 0;
      }
    }

    // HH:mm:00 형식으로 변환
    const formattedTime = `${hour24.toString().padStart(2, '0')}:${newMinute}:00`;
    
    setProfile({
      ...useProfileStore.getState(),
      notificationTime: formattedTime
    });
  };

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-200px)] px-4 sm:px-6 md:px-8 py-8 gap-5">
        <Toaster />
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
          {isEditable ? (
            <button
              onClick={handleImageEdit}
              className="bg-transparent border-0 p-0 cursor-pointer relative"
            >
              <CharacterImage characterId={mainCharacterId} characterImageUrl={mainCharacterImageUrl} />
              <div className="absolute bottom-4 right-4 bg-white rounded-full p-1">
                <SquarePen className="w-6 h-6 text-neutral-500" />
              </div>
            </button>
          ) : (
            <CharacterImage characterId={mainCharacterId} characterImageUrl={mainCharacterImageUrl} />
          )}
        </div>
        <div className="flex flex-col items-center w-full max-w-md mx-auto mt-2">
          <div className="flex w-full justify-between items-center">
            <div className="flex flex-col w-full min-h-[80px]">
              <Input
                className="min-w-48 w-full max-w-72 h-10 mx-auto"
                type="text"
                value={nickname}
                disabled={!isEditable}
                onChange={handleNameChange}
                maxLength={10}
                placeholder="닉네임 (최대 10자)"
              />
              {isEditable && (
                <div className="flex justify-between items-center mt-1 w-full min-w-48 max-w-72 mx-auto">
                  <span className="text-xs text-gray-500">
                    최대 10자까지 입력 가능합니다
                  </span>
                  <span className="text-sm text-gray-500">
                    {nickname.length}/10
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex w-full justify-between items-center">
            <div className="flex min-w-48 w-full max-w-72 mx-auto">
              <span className="`text-sm text-nuetral-700">알림 설정</span>
            </div>
          </div>
          <div className="flex w-full justify-center items-center">
            <div className="flex min-w-48 w-full max-w-72 justify-between items-center">
              <div 
                className={`${notificationTimeEnable ? 'text-black' : 'text-gray-400'} ${isEditable && notificationTimeEnable ? 'cursor-pointer hover:text-primary-500' : ''}`}
                onClick={() => isEditable && notificationTimeEnable && setIsTimePickerOpen(true)}
              >
                {`${ampm} ${hour}:${minute}`}
              </div>
              <Switch 
                checked={notificationTimeEnable} 
                onCheckedChange={handlenotificationTimeEnableChange}
                disabled={!isEditable} 
              />
            </div>
          </div>
          {isEditable && notificationTimeEnable && (
            <TimePicker
              ampm={ampm}
              hour={hour}
              minute={minute}
              onChange={handleTimeChange}
              isOpen={isTimePickerOpen}
              onClose={() => setIsTimePickerOpen(false)}
            />
          )}
          <div className="w-full flex justify-center mt-6 ">
            {isEditable ? (
              <div className="w-full flex flex-col justify-center items-center gap-2">
                <Button className="min-w-48 w-full max-w-72 h-10" variant="primary" onClick={handleCompleteClick}>
                  완료
                </Button>
              </div>
            ) : (
              <Button className="min-w-48 w-full max-w-72 h-10" variant="primary" onClick={handleEditClick}>
                수정하기
              </Button>
            )}
          </div>
        </div>
        <Button className="min-w-48 w-full max-w-72 h-10 mt-4" variant="negative" onClick={handleLogout}>
            로그아웃
        </Button>
        

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

