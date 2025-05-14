import { useEffect, useState } from "react";
import { Outlet, useLocation, useMatch, useNavigate, useParams } from "react-router-dom";
import { Save, Tags } from "lucide-react";
import { updateCardSet, getCardSetById } from "@/services/cardSet";
import { Switch } from "@/components/ui/switch";
import TagRow from "@/components/indexCardView/TagRow";
import CardSetCardlList from "@/components/indexCardView/CardSetCardlList";
import TestSettingDialog from "@/components/dialog/TestSettingDialog";
import { startRecord } from "@/services/map";

const CardSetDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { indexCardId } = useParams();
  const cardSetId = Number(indexCardId);
  const cardFromState = location.state?.card;

  const readonlyMode = location.state?.fromTotalPage ?? false;

  const nickname = location.state?.card?.nickname;
  const [name, setName] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [hashtags, setHashTags] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [editedName, setEditedName] = useState<string>("");
  const [editedTags, setEditedTags] = useState<string[]>([]);
  const [editedIsPublic, setEditedIsPublic] = useState<number>(1);

  const isStudyRoute = Boolean(useMatch("/card-view/:indexCardId/study"));
  const isTTSRoute = Boolean(useMatch("/card-view/:indexCardId/tts"));
  const isTestRoute = Boolean(useMatch("/card-view/:indexCardId/test"));

  useEffect(() => {
    if (!cardSetId || isNaN(cardSetId)) {
      navigate("/card-view", { replace: true });
      return;
    }

    const fetchCardSet = async () => {
      try {
        const { result } = await getCardSetById(cardSetId);
        setName(result.name ?? "");
        setHashTags(result.hashtags ?? []);
        setIsPublic(result.isPublic ? 1 : 0);
      } catch (e) {
        console.error("카드셋 불러오기 실패:", e);
        navigate("/card-view", { replace: true });
      }
    };

    fetchCardSet();
  }, [cardSetId, navigate]);

  const handleStudyClick = async () => {
    try {
      navigate("study", { state: { card: cardFromState } });
      const response = await startRecord(cardSetId, {
        mode: "STUDY",
        latitude: 0.1,
        longitude: 0.1,
      });
      console.log("학습 시작:", response);
      console.log("cardFromState", cardFromState);
    } catch (e) {
      console.error("학습 시작 실패:", e);
    }
  };

  const handleTTSClick = () => navigate("tts", { state: { card: cardFromState } });

  const saveCardSet = async (
    override?: Partial<{ name: string; hashtags: string[]; isPublic: number }>,
  ) => {
    setIsLoading(true);
    try {
      await updateCardSet({
        cardSetId,
        name: override?.name ?? name,
        hashtags: override?.hashtags ?? hashtags,
        isPublic: override?.isPublic ?? isPublic,
      });
    } catch (e) {
      console.error("카드셋 수정 실패:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editedName.trim()) return;
    await saveCardSet({
      name: editedName,
      hashtags: editedTags,
      isPublic: editedIsPublic,
    });
    setName(editedName);
    setHashTags(editedTags);
    setIsPublic(editedIsPublic);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col items-center justify-center py-4 gap-2">
      <div className="relative w-full px-4 max-w-3xl">
        <div className="flex items-center justify-center w-full">
          <input
            type="text"
            value={isEditing ? editedName : name}
            onChange={(e) => {
              const value = e.target.value;
              if (!isEditing || readonlyMode) return;
              if (value.length <= 25) setEditedName(value);
            }}
            className={`text-center text-xl pc:text-3xl font-semibold border-b ${
              editedName.length === 25
                ? "border-negative-400 text-negative-400"
                : "border-neutral-300"
            } focus:outline-none w-full pb-2 px-5`}
            readOnly={!isEditing || readonlyMode}
          />
          {!isStudyRoute &&
            (isEditing ? (
              <button
                onClick={handleSave}
                disabled={isLoading || readonlyMode}
                aria-label="저장"
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <Save
                  size={20}
                  className="text-primary-700 hover:cursor-pointer transition-opacity"
                />
              </button>
            ) : (
              !readonlyMode && (
                <button
                  onClick={() => {
                    setEditedName(name);
                    setEditedTags(hashtags);
                    setEditedIsPublic(isPublic);
                    setIsEditing(true);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <Tags
                    size={20}
                    className="text-primary-700 hover:cursor-pointer transition-opacity"
                  />
                </button>
              )
            ))}
        </div>

        {nickname && (
          <div className="mt-1 text-right text-xs text-muted-foreground pr-2">
            제빵사: <span className="font-medium">{nickname}</span>
          </div>
        )}
      </div>

      {!isStudyRoute && !isTTSRoute && !isTestRoute && (
        <>
          <div className="flex items-center w-full">
            <span className="text-sm text-muted-foreground font-medium whitespace-nowrap pl-6">
              태그 :
            </span>
            <TagRow
              tags={isEditing ? editedTags : hashtags}
              cardSetId={cardSetId}
              isEditing={isEditing && !readonlyMode}
              setEditing={setIsEditing}
              onUpdateTags={(newTags) => {
                setEditedTags(newTags);
              }}
              readonlyMode={readonlyMode}
            />
            {!readonlyMode && (
              <div className="flex text-center gap-2 items-center">
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  <span className="font-semibold">
                    {(isEditing ? editedIsPublic : isPublic) === 1 ? "공개" : "비공개"}
                  </span>
                </div>
                <div className="flex items-center gap-2 pr-2">
                  <Switch
                    checked={(isEditing ? editedIsPublic : isPublic) === 1}
                    onCheckedChange={(checked) => {
                      if (isEditing) {
                        setEditedIsPublic(checked ? 1 : 0);
                      }
                    }}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            )}
          </div>

          <CardSetCardlList cardSetId={cardSetId} isReadonly={readonlyMode} />

          {/* 고정 버튼 */}
          <div className="fixed bottom-[80px] left-1/2 -translate-x-1/2 w-full pc:w-[598px] z-25">
            <div className="flex justify-between w-full gap-2 px-4">
              <button
                onClick={handleStudyClick}
                className="bg-white w-1/3 border-2 border-primary-600 text-primary-600 pc:text-md text-xs py-2 font-semibold rounded-full hover:bg-primary-600 hover:text-white"
              >
                학습하기
              </button>
              <button
                disabled
                className="bg-neutral-200 w-1/3 border-2 pc:text-md text-xs py-2 rounded-full text-neutral-500 cursor-not-allowed"
              >
                TTS 학습하기
              </button>
              <TestSettingDialog />
            </div>
          </div>
        </>
      )}

      <div className="w-full max-w-3xl px-4">
        <Outlet />
      </div>
    </div>
  );
};

export default CardSetDetailPage;
