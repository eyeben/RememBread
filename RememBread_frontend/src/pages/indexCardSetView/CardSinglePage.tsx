import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { indexCard } from "@/types/indexCard";
import { getCardSetById } from "@/services/cardSet";
import { patchCard } from "@/services/card";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import InputBread from "@/components/svgs/breads/InputBread";
import Button from "@/components/common/Button";
import TagRow from "@/components/indexCardView/TagRow";

const CardSinglePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { indexCardId } = useParams();
  const card: indexCard | undefined = location.state?.card;

  const readonlyMode = location.state?.fromTotalPage ?? false;

  const [isFront, setIsFront] = useState(true);
  const [isRotating, setIsRotating] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [lastClickTime, setLastClickTime] = useState<number>(0);

  const [name, setName] = useState<string>("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [nickname, setNickname] = useState<string>("");

  const [concept, setConcept] = useState(card?.concept || "");
  const [description, setDescription] = useState(card?.description || "");
  const [isSaving, setIsSaving] = useState<boolean>(false);

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

  useEffect(() => {
    if (!card) {
      navigate("/card-view", { replace: true });
    }
  }, [card, navigate]);

  if (!card) return null;

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

  const handleSave = async () => {
    if (readonlyMode) return; // 🔒 읽기 전용이면 저장 방지

    setIsSaving(true);
    try {
      await patchCard(card.cardId, {
        concept,
        description,
      });
      toast({
        variant: "success",
        title: "저장 완료",
        description: "카드가 성공적으로 저장되었습니다.",
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "저장 실패",
        description: "카드 저장 중 문제가 발생했습니다.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Toaster />
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

      <div className="flex flex-col justify-between w-full text-center">
        <Button
          className="text-primary-500 text-2xl font-bold pc:m-5 pc-3 py-5"
          variant="primary-outline"
          onClick={handleFlip}
          disabled={isButtonDisabled}
        >
          {!isFront ? "concept" : "description"}
        </Button>
      </div>

      <div className="w-full max-w-md mx-auto px-4 pc:px-0">
        <div className="relative w-full aspect-square">
          <div
            className={`relative transition-transform duration-1000 ${
              isFront ? "rotate-y-0" : "rotate-y-180"
            }`}
          >
            <div
              onClick={handleFlip}
              className="relative w-full h-full aspect-square hover:cursor-pointer"
            >
              <InputBread className="w-full h-full" />
            </div>

            {!isRotating ? (
              readonlyMode ? (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-center">
                  {concept || "제목 없음"}
                </div>
              ) : (
                <input
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  readOnly={readonlyMode}
                  className="absolute top-1/2 left-1/2 w-2/3 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-center bg-transparent border-b-2 border-primary-300 focus:outline-none"
                />
              )
            ) : readonlyMode ? (
              <div
                className="absolute top-[17%] left-[17%] w-2/3 h-3/4 font-bold rotate-y-180 overflow-auto text-left"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {description || "설명이 없습니다."}
              </div>
            ) : (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                readOnly={readonlyMode}
                className="absolute top-[17%] left-[17%] w-2/3 h-3/4 font-bold rotate-y-180 overflow-auto text-left bg-inherit border-none outline-none resize-none"
                style={{ whiteSpace: "pre-wrap", scrollbarWidth: "none" }}
              />
            )}
          </div>
        </div>
      </div>

      {!readonlyMode && (
        <Button className="my-3 mx-auto" variant="primary" onClick={handleSave} disabled={isSaving}>
          저장
        </Button>
      )}
    </div>
  );
};

export default CardSinglePage;
