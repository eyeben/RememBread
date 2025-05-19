import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStudyStore } from "@/stores/studyRecord";
import { indexCard, indexCardSet } from "@/types/indexCard";
import { getCardsByCardSet } from "@/services/card";
import { getTTSFiles } from "@/services/study";
import { startRecord, postLocation, stopRecord } from "@/services/map";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";
import Button from "@/components/common/Button";
import InputBread from "@/components/svgs/breads/InputBread";
import StopStudyModal from "@/components/studyMap/StopStudyModal";
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
  const { location: currentLocation } = useCurrentLocation();
  const cardSet: indexCardSet | undefined = location.state?.card;

  const [api, setApi] = useState<CarouselApi>();
  const [cards, setCards] = useState<indexCard[]>([]);
  const [lastCardId, setLastCardId] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [isFront, setIsFront] = useState<boolean>(true);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [lastClickTime, setLastClickTime] = useState<number>(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [locationIntervalId, setLocationIntervalId] = useState<NodeJS.Timeout | null>(null);
  const isRecordingRef = useRef<boolean>(false);
  const [showStopModal, setShowStopModal] = useState<boolean>(false);

  const [ttsUrl, setTtsUrl] = useState<string | undefined>();
  const [ttsMap, setTtsMap] = useState<Record<number, string>>({});
  const [isTTSMode, setIsTTSMode] = useState<boolean>(false);
  const [ttsMode, setTtsMode] = useState<"single" | "sequence" | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isRecordingRef.current || !cardSet?.cardSetId) return;
      stopRecord(cardSet.cardSetId, {
        lastCardId,
        latitude: currentLocation?.latitude ?? 0,
        longitude: currentLocation?.longitude ?? 0,
      });
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [lastCardId, currentLocation]);

  useEffect(() => {
    const handlePopState = () => {
      if (isRecordingRef.current) {
        setShowStopModal(true);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (!cardSet?.cardSetId) {
      navigate("/card-view", { replace: true });
      return;
    }
    const fetchCards = async () => {
      const res = await getCardsByCardSet(cardSet.cardSetId, 0, 100, "asc");
      setCards(res.result.cards);
    };
    fetchCards();
  }, [cardSet?.cardSetId, navigate]);

  useEffect(() => {
    if (!api) return;
    const updateIndex = () => {
      const snap = api.selectedScrollSnap();
      const cardId = cards[snap]?.cardId ?? 0;
      setCurrentIndex(snap + 1);
      setLastCardId(cardId);
      useStudyStore.getState().setLastCardId(cardId);
    };
    updateIndex();
    api.on("select", updateIndex);
  }, [api, cards]);

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

  useEffect(() => {
    if (!cardSet?.cardSetId || !currentLocation || hasStarted) return;
    const start = async () => {
      await startRecord(cardSet.cardSetId, {
        mode: "STUDY",
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });
      isRecordingRef.current = true;
      setHasStarted(true);
      useStudyStore.getState().setRecording(cardSet.cardSetId);
      const intervalId = setInterval(() => {
        if (!currentLocation) return;
        postLocation(cardSet.cardSetId, currentLocation.latitude, currentLocation.longitude);
      }, 2 * 60 * 1000);
      setLocationIntervalId(intervalId);
    };
    start();
  }, [cardSet?.cardSetId, currentLocation, hasStarted]);

  const handleStopConfirm = async () => {
    if (!cardSet?.cardSetId) return;
    await stopRecord(cardSet.cardSetId, {
      lastCardId,
      latitude: currentLocation?.latitude ?? 0,
      longitude: currentLocation?.longitude ?? 0,
    });
    useStudyStore.getState().stopRecording();
    if (locationIntervalId) clearInterval(locationIntervalId);
    isRecordingRef.current = false;
    setShowStopModal(false);
    navigate(`/card-view`);
  };

  useEffect(() => {
    if (!cardSet?.cardSetId) return;
    const loadTTS = async () => {
      const res = await getTTSFiles(cardSet.cardSetId);
      const map: Record<number, string> = {};
      res.result.forEach((item: { id: number; ttsFileUrl: string }) => {
        map[item.id] = item.ttsFileUrl;
      });
      setTtsMap(map);
    };
    loadTTS();
  }, [cardSet?.cardSetId]);

  useEffect(() => {
    const currentCard = cards[currentIndex - 1];
    const tts = currentCard?.cardId ? ttsMap[currentCard.cardId] : undefined;
    setTtsUrl(tts);
  }, [currentIndex, ttsMap, cards]);

  useEffect(() => {
    if (ttsMode === "sequence" && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, [ttsUrl]);

  return (
    <div className="flex flex-col justify-between h-full w-full text-center gap-2 pc:p-4 p-2">
      <div className="flex justify-between items-center px-4 pt-2">
        <div className="text-sm text-gray-600">
          {currentIndex} / {cards.length}
        </div>
        <Button
          onClick={() => setShowStopModal(true)}
          className="bg-primary-600 text-white font-bold px-4 py-2 rounded-md shadow-md hover:bg-primary-700 transition text-sm pc:text-base"
        >
          학습 종료하기
        </Button>
      </div>

      <Carousel
        setApi={setApi}
        opts={{ align: "center", loop: false }}
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
      <div className="text-center pc:text-md text-sm text-gray-600 mt-[-16px]">
        {currentIndex} / {cards.length}
      </div>

      {/* TTS 제어 UI */}
      {!isTTSMode && (
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => setIsTTSMode(true)}
            className="w-4/5 bg-white text-primary-600 font-bold border border-primary-600 px-6 py-3 my-2 rounded-md shadow-md hover:bg-primary-600 hover:text-white transition pc:h-10 h-8"
          >
            TTS 시작하기
          </Button>
        </div>
      )}

      {isTTSMode && ttsUrl && (
        <div className="flex flex-col pc:gap-2 gap-1 items-center">
          <audio
            ref={audioRef}
            controls
            autoPlay
            src={ttsUrl}
            onEnded={() => {
              if (ttsMode === "sequence" && currentIndex < cards.length) {
                setTimeout(() => {
                  api?.scrollNext();
                }, 1000); // 1초 뒤에 카드 넘김 (기다림 보장)
              }
            }}
            className="w-4/5 pc:h-12 h-8 rounded-md "
          />

          <div className="w-4/5 mx-auto flex justify-between gap-2 mt-1">
            <Button
              onClick={() => setTtsMode("single")}
              className={`flex-1 text-sm pc:text-base px-3 py-2 rounded-lg font-medium transition pc:h-10 h-6 border
              ${
                ttsMode === "single"
                  ? "bg-primary-100 text-primary-700 border-primary-400 hover:bg-primary-100 hover:text-primary-700"
                  : "bg-white text-primary-600 border-primary-300 hover:bg-primary-100"
              }`}
            >
              하나씩 재생
            </Button>
            <Button
              onClick={() => setTtsMode("sequence")}
              className={`flex-1 text-sm pc:text-base px-3 py-2 rounded-lg font-medium transition pc:h-10 h-6 border
                ${
                  ttsMode === "sequence"
                    ? "bg-primary-100 text-primary-700 border-primary-400 hover:bg-primary-100 hover:text-primary-700"
                    : "bg-white text-primary-600 border-primary-300 hover:bg-primary-100"
                }`}
            >
              연속 재생
            </Button>
            <Button
              onClick={() => {
                audioRef.current?.pause();
                setIsTTSMode(false);
                setTtsMode(null);
              }}
              className="flex-1 text-sm pc:text-base bg-white text-red-600 border border-red-300 px-3 py-2 rounded-lg font-medium hover:bg-red-50 transition pc:h-10 h-6"
            >
              종료
            </Button>
          </div>
        </div>
      )}

      {/* <div className="flex gap-4 justify-center mt-2 ">
        <Button
          onClick={() => setShowStopModal(true)}
          className="w-4/5 pc:mt-3 mt-1 bg-primary-600 text-white font-bold px-6 py-3 rounded-md shadow-md hover:bg-primary-700 transition pc:h-10 h-8"
        >
          기록 종료하기
        </Button>
      </div> */}

      <StopStudyModal
        open={showStopModal}
        onOpenChange={(open) => setShowStopModal(open)}
        cardSetId={cardSet?.cardSetId ?? 0}
        onConfirm={handleStopConfirm}
      />
    </div>
  );
};

export default CardStudyPage;
