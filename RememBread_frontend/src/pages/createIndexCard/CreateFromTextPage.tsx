import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/components/common/Button";
import InputBread from "@/components/svgs/breads/InputBread";
import { postCardsByText } from "@/services/card";
import { useToast } from "@/hooks/use-toast";

const CreateFromTextPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [inputText, setInputText] = useState<string>("");

  const handleCreateCard = async () => {
    try {
      toast({
        title: "카드를 생성하는 중입니다.",
        description: "카드 생성이 완료되면 알려드릴게요",
      });

      postCardsByText(inputText)
        .then(() => {
          toast({
            variant: "success",
            title: "카드 생성 완료",
            description: "카드 생성이 완료됐어요!",
          });
        })
        .catch((error) => {
          console.error("카드 생성 중 오류:", error);
          toast({
            variant: "destructive",
            title: "카드 생성 실패",
            description: "카드 생성중 오류가 발생했어요",
          });
        });
    } catch (error) {
      console.error("카드 생성 중 오류:", error);
    } finally {
      setTimeout(() => {
        navigate("/create");
      }, 1500);
    }
  };

  return (
    <div
      className="flex flex-col justify-between w-full text-center"
      style={{ minHeight: "calc(100vh - 120px)" }}
    >
      <h1 className="text-primary-500 text-2xl font-bold m-5">텍스트를 재료로 넣어봐뽱</h1>

      <div className="flex justify-center relative w-full px-5">
        <textarea
          className="absolute top-[17%] left-[17%] pc:left-1/4 w-2/3 pc:w-1/2 h-3/4 bg-inherit border-none outline-none focus:ring-0 shadow-none resize-none font-bold"
          value={inputText}
          placeholder="여기에 텍스트를 입력하세요"
          onChange={(e) => setInputText(e.target.value)}
          style={{
            scrollbarWidth: "none",
          }}
        />

        <InputBread className="w-full h-full max-w-md aspect-square" />
      </div>

      <Button className="m-5" variant="primary" onClick={handleCreateCard}>
        카드 생성하기
      </Button>
    </div>
  );
};

export default CreateFromTextPage;
