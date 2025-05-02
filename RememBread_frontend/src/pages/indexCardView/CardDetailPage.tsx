import { useEffect } from "react";
import { Outlet, useLocation, useMatch, useNavigate } from "react-router-dom";
import TagRow from "@/components/indexCardView/TagRow";

const CardDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { card } = location.state;

  const isStudyRoute = Boolean(useMatch("/card-view/:indexCardId/study"));
  const isTTSRoute = Boolean(useMatch("/card-view/:indexCardId/tts"));
  const isTestRoute = Boolean(useMatch("/card-view/:indexCardId/test"));

  // state가 없다면 목록으로 복귀
  useEffect(() => {
    if (!card) {
      navigate("/card-view", { replace: true });
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
    <div className="flex flex-col items-center justify-center py-10 gap-4">
      <div className="flex justify-between items-center w-full gap-4">
        <p className="w-1/4 text-sm text-neutral-500"></p>
        <h1 className="flex flex-1 justify-center pc:text-3xl text-xl font-semibold">
          카드 상세 보기
        </h1>
        <p className="w-1/4 pc:text-sm text-xxs text-neutral-500">
          현재 선택한 카드 ID: {card.cardSetId}
        </p>
      </div>
      {!isStudyRoute && !isTTSRoute && !isTestRoute && (
        <>
          <TagRow tags={card.hashTags} />

          <div className="pc:mt-24 mt-12 space-y-12 w-1/2">
            <button
              onClick={handleStudyClick}
              className="w-full border-2 border-primary-600 text-primary-600 py-2 font-semibold rounded-full hover:bg-primary-600 hover:text-white"
            >
              학습하기
            </button>
            <button
              onClick={handleTTSClick}
              className="w-full border-2 border-primary-600 text-primary-600 py-2 font-semibold rounded-full hover:bg-primary-600 hover:text-white"
            >
              TTS 학습하기
            </button>
            <button
              onClick={handleTestClick}
              className="w-full border-2 border-primary-600 text-primary-600 py-2 font-semibold rounded-full hover:bg-primary-600 hover:text-white"
            >
              테스트하기
            </button>
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
