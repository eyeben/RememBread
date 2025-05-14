import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";
import InputBread from "@/components/svgs/breads/InputBread";
import { getNextCard, postAnswer, postStopTest } from "@/services/study";

const CardTestConceptPage = () => {
  const navigate = useNavigate();
  const { indexCardId } = useParams();
  const cardSetId = Number(indexCardId);

  const [cardId, setCardId] = useState<number>(0);
  const [concept, setConcept] = useState<string>("");
  const [remainingCardCount, setRemainingCardCount] = useState<number>(101);

  const [isCorrect, setIsCorrect] = useState<null | boolean>(null);

  const fetchCard = async () => {
    try {
      const data = await getNextCard(cardSetId);

      setCardId(data.cardId);
      setConcept(data.concept);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitAnswer = async (correct: boolean) => {
    setIsCorrect(correct);

    setTimeout(() => {
      setIsCorrect(null);
    }, 1000);

    const response = await postAnswer(cardSetId, cardId, correct);

    if (remainingCardCount === 0) {
      handleStopTest();
      return;
    }

    setRemainingCardCount(response.remainingCardCount);

    await fetchCard();
  };

  const handleStopTest = async () => {
    try {
      await postStopTest(cardSetId);
    } catch (error) {
      console.error(error);
    } finally {
      navigate(`/card-view/${cardSetId}`);
    }
  };

  useEffect(() => {
    fetchCard();
  }, []);

  return (
    <div
      className="flex flex-col justify-between w-full text-center"
      style={{ minHeight: "calc(100vh - 120px)" }}
    >
      {isCorrect !== null && (
        <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 text-[200px] z-50 pointer-events-none select-none">
          {isCorrect ? "⭕" : "❌"}
        </div>
      )}
      <div className="m-5 text-xl font-bold">
        {remainingCardCount === 101 ? "테스트가 시작됐어요" : `남은 문제: ${remainingCardCount}`}
      </div>
      <div className="flex justify-center relative w-full px-5">
        <InputBread className="w-full pc:w-4/5 h-full aspect-square" />
        <div
          className="absolute top-1/2 left-1/2 w-2/3 transform -translate-x-1/2 -translate-y-1/2 
                                      text-2xl font-bold cursor-text text-center
                                      line-clamp-5 overflow-hidden break-words"
        >
          {concept}
        </div>
      </div>
      <div className="flex flex-col m-5 gap-5">
        <div className="flex justify-between gap-5"></div>

        {remainingCardCount > 0 ? (
          <div className="flex justify-between gap-5">
            <Button variant="neutral" className="w-full" onClick={handleStopTest}>
              그만하기
            </Button>
            <Button variant="positive" className="w-full" onClick={() => handleSubmitAnswer(true)}>
              알아요
            </Button>
            <Button variant="negative" className="w-full" onClick={() => handleSubmitAnswer(false)}>
              몰라요
            </Button>
          </div>
        ) : (
          <div className="flex justify-between gap-5">
            <Button variant="positive" className="w-full" onClick={() => handleSubmitAnswer(true)}>
              알아요
            </Button>
            <Button variant="negative" className="w-full" onClick={() => handleSubmitAnswer(false)}>
              몰라요
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardTestConceptPage;
