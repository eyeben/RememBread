import { useState } from "react";
import Button from "@/components/common/Button";
import InputBread from "@/components/svgs/InputBread";
import { indexCardSet } from "@/types/indexCard";
import { createEmptyCard } from "@/utils/createEmptyCard";

const CreateFromSelf = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFront, setIsFront] = useState<boolean>(true);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  const [cardSet, setCardSet] = useState<indexCardSet>({
    folderId: BigInt(0),
    hashTags: [],
    breads: [createEmptyCard()],
  });

  const handleNext = () => {
    setCardSet((prev) => {
      const nextIndex = currentIndex + 1;
      let newBreads = [...prev.breads];

      if (nextIndex >= prev.breads.length) {
        newBreads.push(createEmptyCard());
      }

      return { ...prev, breads: newBreads };
    });

    setCurrentIndex((prev) => prev + 1);
    setIsFront(true);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
    setIsFront(true);
  };

  const handleFlip = () => {
    setIsFront((prev) => !prev);

    setIsButtonDisabled(true);

    setTimeout(() => {
      setIsRotating(!isRotating);
      setIsButtonDisabled(false);
    }, 260);
  };

  return (
    <div
      className="flex flex-col justify-between w-full text-center"
      style={{ minHeight: "calc(100vh - 120px)" }}
    >
      <h1 className="text-primary-500 text-2xl font-bold m-5">빵 굽기</h1>

      <div
        className={`relative w-full h-full transition-transform duration-700 ${
          isFront ? "rotate-y-0" : "rotate-y-180"
        }`}
      >
        <div className={!isRotating ? "rotate-y-0" : "rotate-y-180"}>
          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold top-1/4">
            {!isRotating ? "concept" : "description"}
          </h1>
        </div>

        {!isRotating ? (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">
            {cardSet.breads[currentIndex]?.concept}제목임
          </div>
        ) : (
          <textarea
            className="absolute top-1/3 left-1/3 w-1/3 h-1/3 bg-inherit border-none outline-none focus:ring-0 shadow-none resize-none font-bold rotate-y-180"
            value={cardSet.breads[currentIndex]?.description}
            placeholder="여기에 텍스트를 입력하세요"
            onChange={(e) => {
              const updatedDescription = e.target.value;
              setCardSet((prev) => {
                const newBreads = [...prev.breads];
                newBreads[currentIndex] = {
                  ...newBreads[currentIndex],
                  description: updatedDescription,
                };
                return { ...prev, breads: newBreads };
              });
            }}
            style={{
              scrollbarWidth: "none",
            }}
          />
        )}

        <InputBread className="w-full" />
      </div>

      <div>
        {currentIndex + 1} / {cardSet.breads.length}
      </div>

      <div className="w-full">
        <Button
          className="mx-5 w-12"
          variant="primary-outline"
          onClick={handleFlip}
          disabled={isButtonDisabled}
        >
          뒤집기
        </Button>
      </div>

      <Button className="mt-5 mx-5" variant="primary">
        생성
      </Button>

      <div className="flex w-full my-5">
        <Button className="w-full mx-5" variant="primary" onClick={handlePrev}>
          이전
        </Button>
        <Button className="w-full mx-5" variant="primary" onClick={handleNext}>
          다음
        </Button>
      </div>
    </div>
  );
};

export default CreateFromSelf;
