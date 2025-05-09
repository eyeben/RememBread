import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/components/common/Button";
import InputBread from "@/components/svgs/breads/InputBread";
import { postCardsByText } from "@/services/card";

const CreateFromTextPage = () => {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState<string>("");

  const handleCreateCard = async () => {
    try {
      postCardsByText(inputText);
    } catch (error) {
      console.error("카드 생성 중 오류:", error);
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      navigate("/create");
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
