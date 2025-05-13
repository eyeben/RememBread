import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";
import { Input } from "@/components/ui/input";
import InputBread from "@/components/svgs/breads/InputBread";
import { getNextCard, postAnswer, postStopTest } from "@/services/study";

const CardTestConceptPage = () => {
  const navigate = useNavigate();
  const { indexCardId } = useParams();
  const cardSetId = Number(indexCardId);

  const [answer, setAnswer] = useState<string>("");
  const [cardId, setCardId] = useState<number>(0);
  const [concept, setConcept] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [remainingCardCount, setRemainingCardCount] = useState<number>(101);

  const [isCorrect, setIsCorrect] = useState<null | boolean>(null);

  const fetchCard = async () => {
    try {
      const data = await getNextCard(cardSetId);

      setCardId(data.cardId);
      setConcept(data.concept);
      setDescription(data.description);
    } catch (error) {
      console.error(error);
    }
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

  const handleSubmitAnswer = async () => {
    const trimmedAnswer = answer.replace(/\s/g, "");
    const trimmedConcept = concept.replace(/\s/g, "");
    const correct = trimmedAnswer === trimmedConcept;

    setIsCorrect(correct);

    setTimeout(() => {
      setIsCorrect(null);
    }, 1000);

    setAnswer("");

    const response = await postAnswer(cardSetId, cardId, trimmedAnswer === trimmedConcept);

    if (remainingCardCount === 0) {
      handleStopTest();
      return;
    }

    setRemainingCardCount(response.remainingCardCount);

    await fetchCard();
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
        <div className="absolute top-[17%] left-[22%] w-[56%] h-3/4 bg-inherit border-none outline-none focus:ring-0 shadow-none font-bold overflow-auto break-words whitespace-pre-wrap">
          {description}
        </div>
      </div>
      <div className="flex flex-col m-5 gap-5">
        <div>
          <div className="text-left">정답 입력</div>
          <Input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmitAnswer();
              }
            }}
          />
        </div>

        {remainingCardCount > 0 ? (
          <div className="flex justify-between gap-5">
            <Button variant="neutral" className="w-full" onClick={handleStopTest}>
              그만하기
            </Button>
            <Button variant="primary" className="w-full" onClick={handleSubmitAnswer}>
              제출하기
            </Button>
          </div>
        ) : (
          <div className="flex justify-between gap-5">
            <Button variant="neutral" className="w-full" onClick={handleStopTest}>
              그만하기
            </Button>
            <Button variant="primary" className="w-full" onClick={handleSubmitAnswer}>
              제출하고 종료하기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardTestConceptPage;
