import { useEffect, useState } from "react";
import { Outlet, useLocation, useMatch, useNavigate } from "react-router-dom";
import TagRow from "@/components/indexCardView/TagRow";
import CardDetailList from "@/components/indexCardView/CardDetailList";
import CardDetailButtons from "@/components/indexCardView/CardDetailButtons";

const CardDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const card = location.state?.card;

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const toggleEditing = () => setIsEditing((prev) => !prev);

  const isStudyRoute = Boolean(useMatch("/card-view/:indexCardId/study"));
  const isTTSRoute = Boolean(useMatch("/card-view/:indexCardId/tts"));
  const isTestRoute = Boolean(useMatch("/card-view/:indexCardId/test"));

  useEffect(() => {
    if (!card) {
      navigate("/card-view/my", { replace: true });
    }
  }, [card, navigate]);

  if (!card) return null;

  const handleStudyClick = () => {
    navigate("study", { state: { card } });
  };

  const handleTTSClick = () => {
    navigate("tts", { state: { card } });
  };

  const handleTestClick = () => {
    navigate("test", { state: { card } });
  };

  return (
    <div className="flex flex-col items-center justify-center py-4 gap-4">
      <div className="flex justify-center items-center w-full">
        <h1 className="flex flex-1 justify-center pc:text-3xl text-xl font-semibold">
          {card.cardSetId}번 카드 상세 보기
        </h1>
      </div>

      {!isStudyRoute && !isTTSRoute && !isTestRoute && (
        <>
          <TagRow
            tags={card.hashTags ?? []}
            cardSetId={card.cardSetId}
            name={card.name}
            isPublic={card.isPublic}
            isEditing={isEditing}
            setEditing={setIsEditing}
          />
          <CardDetailList cardSetId={card.cardSetId} />

          <CardDetailButtons
            onStudyClick={handleStudyClick}
            onTTSClick={handleTTSClick}
            onTestClick={handleTestClick}
          />
        </>
      )}

      <div className="w-full max-w-3xl px-4">
        <Outlet />
      </div>
    </div>
  );
};

export default CardDetailPage;
