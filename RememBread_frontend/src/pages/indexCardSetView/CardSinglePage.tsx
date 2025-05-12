import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { indexCard } from "@/types/indexCard";
import InputBread from "@/components/svgs/breads/InputBread";
import Button from "@/components/common/Button";
import TagRow from "@/components/indexCardView/TagRow";
import { getCardSetById } from "@/services/cardSet";

const CardSinglePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { indexCardId } = useParams();
  const card: indexCard | undefined = location.state?.card;

  const [isFront, setIsFront] = useState(true);
  const [isRotating, setIsRotating] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [lastClickTime, setLastClickTime] = useState<number>(0);

  // 카드셋 정보 상태
  const [name, setName] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [nickname, setNickname] = useState("");

  // 카드셋 정보 가져오기
  useEffect(() => {
    if (!indexCardId || isNaN(Number(indexCardId))) {
      navigate("/card-view", { replace: true });
      return;
    }

    const fetchCardSet = async () => {
      try {
        const { result } = await getCardSetById(Number(indexCardId));
        setName(result.name ?? "");
        setHashtags(result.hashtags ?? []);
        setNickname(result.nickname ?? "");
      } catch (e) {
        console.error("카드셋 정보 불러오기 실패:", e);
      }
    };

    fetchCardSet();
  }, [indexCardId, navigate]);

  if (!card) {
    navigate("/card-view", { replace: true });
    return null;
  }

  const handleFlip = () => {
    const now = Date.now();
    if (now - lastClickTime < 400) return;
    setLastClickTime(now);

    setIsFront((prev) => !prev);
    setIsButtonDisabled(true);
    setTimeout(() => {
      setIsRotating(!isRotating);
      setIsButtonDisabled(false);
    }, 310);
  };

  return (
    <div className="flex flex-col items-center justify-center py-4 gap-4">
      {/* 제목, 작성자 */}
      <div className="w-full max-w-3xl px-4">
        <input
          type="text"
          value={name}
          readOnly
          className="text-center text-xl pc:text-3xl font-semibold border-b border-neutral-300 w-full pb-2 bg-transparent"
        />
        {nickname && (
          <div className="mt-1 text-right text-xs text-muted-foreground pr-2">
            제빵사: <span className="font-medium">{nickname}</span>
          </div>
        )}
      </div>

      {/* 태그 */}
      <div className="flex items-center w-full max-w-3xl">
        <span className="text-sm text-muted-foreground font-medium whitespace-nowrap pl-6">
          태그 :
        </span>
        <TagRow
          tags={hashtags}
          cardSetId={Number(indexCardId)}
          isEditing={false}
          setEditing={() => {}}
          onUpdateTags={() => {}}
          readonlyMode={true}
        />
      </div>

      {/* 카드 단면 */}
      <div className="flex flex-col justify-between w-full text-center">
        <Button
          className="text-primary-500 text-2xl font-bold m-5 py-5"
          variant="primary-outline"
          onClick={handleFlip}
          disabled={isButtonDisabled}
        >
          {!isFront ? "concept" : "description"}
        </Button>
      </div>

      <div className="w-full max-w-md mx-auto px-4 pc:px-0">
        <div className="relative w-full aspect-square" onClick={handleFlip}>
          <div
            className={`relative transition-transform duration-1000 ${
              isFront ? "rotate-y-0" : "rotate-y-180"
            }`}
          >
            <InputBread className="w-full h-full aspect-square hover:cursor-pointer" />

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
      </div>
    </div>
  );
};

export default CardSinglePage;
