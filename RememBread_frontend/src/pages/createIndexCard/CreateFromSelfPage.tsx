import { useEffect, useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/components/common/Button";
import InputBread from "@/components/svgs/breads/InputBread";
import { createEmptyCard } from "@/utils/createEmptyCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useCardStore } from "@/stores/cardStore";

const CreateFromSelfPage = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [isFront, setIsFront] = useState<boolean>(true);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  const { cardSet, setCardSet } = useCardStore();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrentIndex(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrentIndex(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleFlip = () => {
    setIsFront((prev) => !prev);

    setIsButtonDisabled(true);

    setTimeout(() => {
      setIsRotating(!isRotating);
      setIsButtonDisabled(false);
    }, 310);
  };

  const handleAddCard = () => {
    const newCardLength = cardSet.length;
    const updated = [...cardSet, createEmptyCard()];
    setCardSet(updated);

    setTimeout(() => {
      api?.scrollTo(newCardLength);
    }, 10);
  };

  const handleDeleteCard = () => {
    if (cardSet.length === 0 || currentIndex === 0) return;

    const updatedCardSet = [...cardSet];
    updatedCardSet.splice(currentIndex - 1, 1);
    setCardSet(updatedCardSet);

    const newIndex = currentIndex === cardSet.length ? currentIndex - 1 : currentIndex;
    setCurrentIndex(newIndex);

    setTimeout(() => {
      api?.scrollTo(newIndex - 1);
    }, 10);
  };

  const handeleSaveCard = () => {
    navigate("/save");
  };

  const handleConceptChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const updatedConcept = e.target.value;
    const updatedCards = [...cardSet];

    updatedCards[index] = {
      ...updatedCards[index],
      concept: updatedConcept,
    };

    setCardSet(updatedCards);
  };

  return (
    <div
      className="flex flex-col justify-between w-full text-center"
      style={{ minHeight: "calc(100vh - 120px)" }}
    >
      <Button
        className="text-primary-500 text-2xl font-bold m-5 py-5"
        variant="primary-outline"
        onClick={handleFlip}
        disabled={isButtonDisabled}
      >
        {!isFront ? "concept" : "description"}
      </Button>

      <div className="">
        {currentIndex} / {cardSet.length}
      </div>

      <Carousel
        setApi={setApi}
        opts={{
          align: "center",
          loop: false,
        }}
        className="w-full max-w-md mx-auto px-4 pc:px-0"
      >
        <CarouselContent className="aspect-square">
          {cardSet.map((indexCard, index) => (
            <CarouselItem key={index} className={`relative`}>
              <div className="relative w-full h-full">
                <div
                  className={`relative transition-transform duration-1000 ${
                    isFront ? "rotate-y-0" : "rotate-y-180"
                  }`}
                >
                  <InputBread className="w-full h-full aspect-square" />

                  {!isRotating ? (
                    editingIndex === index ? (
                      <input
                        autoFocus
                        type="text"
                        value={indexCard.concept}
                        onChange={(e) => handleConceptChange(e, index)}
                        onBlur={() => setEditingIndex(null)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setEditingIndex(null);
                          }
                        }}
                        className="absolute top-1/2 left-1/2 w-2/3 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-center bg-transparent border-b-2 border-primary-300 focus:outline-none"
                      />
                    ) : (
                      <div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold cursor-text"
                        onClick={() => setEditingIndex(index)}
                      >
                        {indexCard.concept || "제목 없음"}
                      </div>
                    )
                  ) : (
                    <textarea
                      className="absolute top-[17%] left-[17%] w-2/3 h-3/4 bg-inherit border-none outline-none focus:ring-0 shadow-none resize-none font-bold rotate-y-180"
                      value={indexCard.description}
                      placeholder="여기에 텍스트를 입력하세요"
                      onChange={(e) => {
                        const updatedDescription = e.target.value;
                        const updatedCards = [...cardSet];
                        updatedCards[index] = {
                          ...updatedCards[index],
                          description: updatedDescription,
                        };
                        setCardSet(updatedCards);
                      }}
                      style={{
                        scrollbarWidth: "none",
                      }}
                    />
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden pc:flex pc:items-center pc:justify-center pc:w-10 pc:h-10" />

        {cardSet.length > 1 && (
          <div
            className="absolute flex justify-center items-center rounded-full font-bold top-0 left-0 mx-5 w-10 h-10 bg-neutral-300 text-700 pc:mx-0 focus-visible:ring-ring focus-visible:ring-1 hover:bg-accent cursor-pointer"
            onClick={handleDeleteCard}
          >
            -
          </div>
        )}

        {currentIndex === cardSet.length && (
          <div
            className="absolute flex justify-center items-center rounded-full font-bold top-0 right-0 mx-5 w-10 h-10 bg-primary-500 text-700 pc:hidden"
            onClick={handleAddCard}
          >
            +
          </div>
        )}

        {currentIndex === cardSet.length ? (
          <CarouselNext
            className="hidden bg-primary-500 text-700 pc:flex pc:items-center pc:justify-center pc:w-10 pc:h-10 disabled:pointer-events-auto"
            onClick={handleAddCard}
            disabled={false}
          />
        ) : (
          <CarouselNext className="hidden pc:flex pc:items-center pc:justify-center pc:w-10 pc:h-10" />
        )}
      </Carousel>

      <Button className="my-5 mx-5" variant="primary" onClick={handeleSaveCard}>
        생성
      </Button>
    </div>
  );
};

export default CreateFromSelfPage;
