import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { patchNotificationLocation, stopRecord } from "@/services/map";
import { useStudyStore } from "@/stores/studyRecord";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";
import DefaultBread from "@/components/svgs/breads/DefaultBread";
import StopStudyModal from "@/components/studyMap/StopStudyModal";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { location: currentLocation } = useCurrentLocation();
  const [showStopModal, setShowStopModal] = useState<boolean>(false);
  const { isRecording, cardSetId, lastCardId, stopRecording } = useStudyStore();
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // '/card-view/숫자' 형태의 경로에만 표시
  const showBackButton = /^\/card-view\/\d+(\/.*)?$/.test(location.pathname);

  const handleBack = () => {
    if (isRecording) {
      setPendingAction(() => () => navigate(-1));
      setShowStopModal(true);
    } else {
      navigate(-1);
    }
  };

  const handleStopConfirm = async () => {
    if (!cardSetId) return;

    const latitude = currentLocation?.latitude ?? 0;
    const longitude = currentLocation?.longitude ?? 0;

    try {
      console.log("Header 기록 종료", { cardSetId, lastCardId, latitude, longitude });
      await stopRecord(cardSetId, { lastCardId, latitude, longitude });
      stopRecording();
    } catch (e) {
      console.error("Header 기록 종료 실패", e);
    }

    setShowStopModal(false);
    pendingAction?.();
    setPendingAction(null);
  };

  // 30초마다 현재 위치 전송
  useEffect(() => {
    if (!currentLocation) return;

    const intervalId = setInterval(() => {
      const { latitude, longitude } = currentLocation;
      patchNotificationLocation(latitude, longitude, true)
        .then(() => {
          console.log("위치 전송 성공:", { latitude, longitude });
        })
        .catch((err) => {
          console.error("위치 전송 실패:", err);
        });
    }, 30000); // 30초

    return () => clearInterval(intervalId); // cleanup
  }, [currentLocation]);

  return (
    <header className="fixed w-full max-w-[600px] min-h-14 mx-auto bg-white pc:border-x border-b border-neutral-200 z-30 pt-[env(safe-area-inset-top)] top-0 left-0 right-0">
      <nav className="h-full mx-auto">
        <ul className="flex justify-between items-center w-full min-h-14 px-5 relative">
          {/* 왼쪽 뒤로가기 버튼 (조건부 렌더링) */}
          {showBackButton && (
            <li className="flex items-center">
              <button onClick={handleBack} className="p-1">
                <ChevronLeft size={20} />
              </button>
            </li>
          )}

          {/* 가운데 로고 */}
          <li className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
            <button
              onClick={() => {
                if (isRecording) {
                  setPendingAction(() => () => navigate("/card-view"));
                  setShowStopModal(true);
                } else {
                  navigate("/card-view");
                }
              }}
            >
              <DefaultBread />
            </button>
          </li>
        </ul>
      </nav>
      <StopStudyModal
        open={showStopModal}
        onOpenChange={(open) => {
          setShowStopModal(open);
          if (!open) setPendingAction(null);
        }}
        cardSetId={cardSetId ?? 0}
        onConfirm={handleStopConfirm}
      />
    </header>
  );
};

export default Header;
