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
      try {
        const res = await getCardsByCardSet(cardSet.cardSetId, 0, 100, "asc");
        setCards(res.result.cards);
      } catch (e) {
        console.error("[카드 로딩 실패]", e);
      }
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

  // 학습 시작
  useEffect(() => {
    if (!cardSet?.cardSetId || !currentLocation || hasStarted) return;
    const start = async () => {
      try {
        await startRecord(cardSet.cardSetId, {
          mode: "STUDY",
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        });
        console.log("[START] startRecord 호출됨", {
          cardSetId: cardSet.cardSetId,
          currentLocation,
        });
        isRecordingRef.current = true;
        setHasStarted(true);
        useStudyStore.getState().setRecording(cardSet.cardSetId);
        const intervalId = setInterval(() => {
          if (!currentLocation) return;
          postLocation(cardSet.cardSetId, currentLocation.latitude, currentLocation.longitude)
            .then(() => console.log("위치 전송 완료"))
            .catch((e) => console.error("위치 전송 실패", e));
        }, 2 * 60 * 1000);
        setLocationIntervalId(intervalId);
      } catch (e) {
        console.error("학습 시작 실패", e);
      }
    };
    start();
  }, [cardSet?.cardSetId, currentLocation, hasStarted]);

  const handleStopConfirm = async () => {
    if (!cardSet?.cardSetId) return;

    const stopPayload = {
      lastCardId,
      latitude: currentLocation?.latitude ?? 0,
      longitude: currentLocation?.longitude ?? 0,
    };

    console.log("[STOP] stopRecord 호출됨", {
      cardSetId: cardSet.cardSetId,
      ...stopPayload,
    });

    await stopRecord(cardSet.cardSetId, stopPayload);
    useStudyStore.getState().stopRecording();
    if (locationIntervalId) clearInterval(locationIntervalId);
    isRecordingRef.current = false;
    setShowStopModal(false);

    navigate(`/card-view`);
  };

  // TTS로 학습하기
  const handleTTSClick = async () => {
    if (!cardSet?.cardSetId) return;

    try {
      const res = await getTTSFiles(cardSet.cardSetId);
      if (res.result.length === 0) {
        alert("TTS 파일이 존재하지 않습니다.");
      } else {
        setTtsUrl(res.result[0].ttsFileUrl); // 버튼 대신 player로 대체
      }
    } catch (e) {
      console.error("TTS 파일 조회 실패", e);
      alert("TTS 파일을 불러오는 데 실패했습니다.");
    }
  };

  // TTS 파일 로딩
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

  // 카드 넘길 때마다 TTS URL 갱신
  useEffect(() => {
    const currentCard = cards[currentIndex - 1];
    const tts = currentCard?.cardId ? ttsMap[currentCard.cardId] : undefined;
    setTtsUrl(tts);
  }, [currentIndex, ttsMap, cards]);

  return (
    <div className="flex flex-col justify-between w-full text-center gap-2">
      <Button
        className="text-primary-500 text-2xl font-bold pc:m-2 m-5 py-5"
        variant="primary-outline"
        onClick={handleFlip}
        disabled={isButtonDisabled}
      >
        {!isFront ? "concept" : "description"}
      </Button>
      <div>
        {currentIndex} / {cards.length}
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
      <div className="flex gap-4 justify-center mt-2 ">
        {ttsUrl && (
          <div className="flex gap-4 justify-center mt-2">
            <audio
              controls
              autoPlay
              src={ttsUrl}
              className="w-4/5 rounded-md border border-primary-600 shadow-md"
            />
          </div>
        )}
      </div>
      <div className="flex gap-4 justify-center mt-2 ">
        <Button
          onClick={() => setShowStopModal(true)}
          className="w-4/5 pc:mt-5 mt-1 bg-primary-600 text-white font-bold px-6 py-3 rounded-md shadow-md hover:bg-primary-700 transition"
        >
          기록 종료하기
        </Button>
      </div>
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
