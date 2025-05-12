import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { indexCard, indexCardSet } from "@/types/indexCard";
import { getCardsByCardSet } from "@/services/card";
import Button from "@/components/common/Button";
import InputBread from "@/components/svgs/breads/InputBread";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const CardStudyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cardSet: indexCardSet | undefined = location.state?.card;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFront, setIsFront] = useState<boolean>(true);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [cards, setCards] = useState<indexCard[]>([]);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!cardSet?.cardSetId) {
      navigate("/card-view", { replace: true });
      return;
    }

    const fetchCards = async () => {
      try {
        const res = await getCardsByCardSet(cardSet.cardSetId, 0, 100, "asc");
        setCards(res.result.cards);
      } catch (error) {
        console.error("카드 불러오기 실패:", error);
      }
    };

    fetchCards();
  }, [cardSet?.cardSetId, navigate]);

  useEffect(() => {
    if (!api) return;
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

  return (
    <div className="flex flex-col justify-between w-full text-center gap-2">
      <Button
        className="text-primary-500 text-2xl font-bold pc:m-2 m-5 py-5"
        variant="primary-outline"
        onClick={handleFlip}
        disabled={isButtonDisabled}
      >
        {!isFront ? "concept" : "description"}
      </Button>

      <div>
        {currentIndex} / {cards.length}
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
          {cards.map((card, index) => (
            <CarouselItem key={card.cardId ?? index} className="relative">
              <div className="relative w-full h-full hover:cursor-pointer" onClick={handleFlip}>
                <div
                  className={`relative transition-transform duration-1000 ${
                    isFront ? "rotate-y-0" : "rotate-y-180"
                  }`}
                >
                  <InputBread className="w-full h-full aspect-square" />

                  {!isRotating ? (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">
                      {card.concept || "제목 없음"}
                    </div>
                  ) : (
                    <div
                      className="absolute top-[17%] left-[17%] w-2/3 h-3/4 font-bold rotate-y-180 overflow-auto text-left"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {card.description || "설명이 없습니다."}
                    </div>
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden pc:flex pc:items-center pc:justify-center pc:w-10 pc:h-10" />
        <CarouselNext className="hidden pc:flex pc:items-center pc:justify-center pc:w-10 pc:h-10" />
      </Carousel>
    </div>
  );
};

export default CardStudyPage;
