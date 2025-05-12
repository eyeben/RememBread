import { useEffect, useState } from "react";
import { Outlet, useLocation, useMatch, useNavigate, useParams } from "react-router-dom";
import { Save, Tags } from "lucide-react";
import { updateCardSet, getCardSetById } from "@/services/cardSet";
import { Switch } from "@/components/ui/switch";
import TagRow from "@/components/indexCardView/TagRow";
import CardSetCardlList from "@/components/indexCardView/CardSetCardlList";
import CardDetailButtons from "@/components/indexCardView/CardDetailButtons";

const CardDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { indexCardId } = useParams();
  const cardSetId = Number(indexCardId);
  const cardFromState = location.state?.card;

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
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

  const handleStudyClick = () => navigate("study", { state: { card: cardFromState } });
  const handleTTSClick = () => navigate("tts", { state: { card: cardFromState } });
  const handleTestClick = () => navigate("test", { state: { card: cardFromState } });

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
    <div className="flex flex-col items-center justify-center py-4 gap-4">
      {/* 이름 수정 영역 + 편집 버튼 */}
      <div className="flex justify-center items-center w-full gap-2 px-4">
        <input
          type="text"
          value={isEditing ? editedName : name}
          onChange={(e) => isEditing && setEditedName(e.target.value)}
          className="text-xl pc:text-3xl font-semibold text-center border-b focus:outline-none w-full max-w-xl"
          maxLength={30}
          readOnly={!isEditing}
        />

        {isEditing ? (
          <button onClick={handleSave} disabled={isLoading} aria-label="저장">
            <Save size={20} className="text-primary-700 hover:cursor-pointer transition-opacity" />
          </button>
        ) : (
          <button
            onClick={() => {
              setEditedName(name);
              setEditedTags(hashtags);
              setEditedIsPublic(isPublic);
              setIsEditing(true);
            }}
          >
            <Tags size={20} className="text-primary-700 hover:cursor-pointer transition-opacity" />
          </button>
        )}
      </div>

      {!isStudyRoute && !isTTSRoute && !isTestRoute && (
        <>
          <div className="flex items-center gap-2 px-2 w-full ">
            <TagRow
              tags={isEditing ? editedTags : hashtags}
              cardSetId={cardSetId}
              isEditing={isEditing}
              setEditing={setIsEditing}
              onUpdateTags={(newTags) => {
                setEditedTags(newTags);
              }}
            />
            {/* 현재 공개 상태 텍스트 */}
            <div className="flex text-center gap-2 items-center w-[80px]">
              <div className="text-xs text-muted-foreground whitespace-nowrap ">
                <span className="font-semibold">
                  {(isEditing ? editedIsPublic : isPublic) === 1 ? "공개" : "비공개"}
                </span>
              </div>

              <div className="flex items-center gap-2 pr-2">
                <Switch
                  checked={(isEditing ? editedIsPublic : isPublic) === 1}
                  onCheckedChange={(checked) => {
                    if (isEditing) {
                      const newIsPublic = checked ? 1 : 0;
                      setEditedIsPublic(newIsPublic);
                    }
                  }}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          <CardSetCardlList cardSetId={cardSetId} />

          <div className="fixed bottom-[80px] left-1/2 -translate-x-1/2 w-full pc:w-[598px] z-25">
            <CardDetailButtons
              onStudyClick={handleStudyClick}
              onTTSClick={handleTTSClick}
              onTestClick={handleTestClick}
            />
          </div>
        </>
      )}

      <div className="w-full max-w-3xl px-4">
        <Outlet />
      </div>
    </div>
  );
};

export default CardDetailPage;
