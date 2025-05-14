import { useEffect, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { indexCardSet } from "@/types/indexCard";
import { searchMyCardSet, SearchMyCardSetParams } from "@/services/cardSet";
import { getRoutes } from "@/services/map";
import CurrentLocationBtn from "@/components/studyMap/CurrentLocationBtn";
import CurrentLocation from "@/components/studyMap/CurrentLocation";
import MarkerStudyBread from "@/components/svgs/breads/MarkerStudyBread";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const MapView = () => {
  const [curLatitude, setCurLatitude] = useState<number>(37.5665);
  const [curLongitude, setCurLongitude] = useState<number>(126.978);
  const [locationKey, setLocationKey] = useState<number>(0);
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);

  const [myCardSets, setMyCardSets] = useState<indexCardSet[]>([]);
  const [routesByCardSet, setRoutesByCardSet] = useState<any[]>([]);
  const [selectedCardSet, setSelectedCardSet] = useState<number>(0);
  const [selectedDateTime, setSelectedDateTime] = useState<string>("");
  const [totalCount, setTotalCount] = useState<number>(0);

  const mapRef = useRef<naver.maps.Map | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);

  // 내 카드셋 목록 불러오기
  const fetchMyCardSets = async () => {
    try {
      const params: SearchMyCardSetParams = {
        query: "",
        page: 0,
        size: 100,
        cardSetSortType: "최신순",
      };
      const { result } = await searchMyCardSet(params);
      setMyCardSets(result.cardSets);
    } catch (err) {
      console.error("내 카드셋 조회 실패:", err);
    }
  };

  // 카드셋 선택 시 학습 이력(routes) 조회
  useEffect(() => {
    if (!selectedCardSet) return;

    const fetchRoutes = async () => {
      try {
        setRoutesByCardSet([]);
        setTotalCount(0);

        // 기존 마커 제거
        markersRef.current.forEach((m) => m.setMap(null));
        markersRef.current = [];

        // 날짜 초기화
        setSelectedDateTime("");

        // 경로 재조회
        const { result } = await getRoutes(selectedCardSet, 0, 10);
        setRoutesByCardSet(result.routes);
        setTotalCount(result.total);
      } catch (err) {
        console.error("학습 이력 조회 실패:", err);
      }
    };

    fetchRoutes();
  }, [selectedCardSet]);

  // 날짜 선택 시 해당 경로만 마커로 표시
  useEffect(() => {
    if (!mapRef.current || !selectedDateTime) return;

    const matched = routesByCardSet.find((r) => r.studiedAt === selectedDateTime);
    if (!matched) return;

    // 기존 마커 제거
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const breadSvg = ReactDOMServer.renderToStaticMarkup(<MarkerStudyBread />);
    const size = 32;

    matched.route.forEach((coords: [number, number]) => {
      const [lng, lat] = coords;
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(lat, lng),
        icon: {
          content: breadSvg,
          size: new naver.maps.Size(size, size),
          anchor: new naver.maps.Point(size / 2, size / 2),
        },
        map: mapRef.current!,
      });

      markersRef.current.push(marker);
    });
  }, [selectedDateTime]);

  // 최초 지도 초기화 및 카드셋 로딩
  useEffect(() => {
    const mapElement = document.getElementById("map");
    if (!mapElement) return;

    if (!mapRef.current) {
      mapRef.current = new naver.maps.Map(mapElement, {
        center: new naver.maps.LatLng(curLatitude, curLongitude),
        zoom: 15,
        zoomControl: false,
        zoomControlOptions: {
          style: naver.maps.ZoomControlStyle.SMALL,
          position: naver.maps.Position.TOP_RIGHT,
        },
      });

      setIsMapLoaded(true);
    }

    fetchMyCardSets();
  }, []);

  useEffect(() => {
    if (routesByCardSet.length > 0) {
      setSelectedDateTime(routesByCardSet[0].studiedAt);
    }
  }, [routesByCardSet]);

  const handleLocationUpdate = (lat: number, lng: number) => {
    setCurLatitude(lat);
    setCurLongitude(lng);
  };

  useEffect(() => {
    if (!mapRef.current || !selectedCardSet || !selectedDateTime) return;

    const matched = routesByCardSet.find((r) => r.studiedAt === selectedDateTime);
    if (!matched || !matched.route || matched.route.length === 0) return;

    const [lng, lat] = matched.route[0]; // 첫 번째 좌표 사용
    mapRef.current.setCenter(new naver.maps.LatLng(lat, lng));
  }, [selectedCardSet, selectedDateTime]);

  return (
    <div className="relative w-full" style={{ height: "calc(100vh - 7.5rem)" }}>
      {/* 상단 Selector */}
      <div className="absolute top-4 left-4 right-4 z-10 flex gap-2">
        {/* 카드셋 셀렉터 (60%) */}
        <div className="w-3/5 bg-white opacity-100 rounded-md ">
          <Select
            value={selectedCardSet ? String(selectedCardSet) : ""}
            onValueChange={(v) => setSelectedCardSet(Number(v))}
          >
            <SelectTrigger className="w-full">
              {selectedCardSet !== 0 ? (
                <span>
                  {myCardSets.find((set) => set.cardSetId === selectedCardSet)?.name}{" "}
                  <span className="text-sm text-muted-foreground"> ({totalCount}건)</span>
                </span>
              ) : (
                <SelectValue placeholder="조회하실 카드셋을 선택해주세요" />
              )}
            </SelectTrigger>

            <SelectContent>
              {myCardSets.map((cardSet) => (
                <SelectItem key={cardSet.cardSetId} value={String(cardSet.cardSetId)}>
                  {cardSet.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 날짜 셀렉터 (40%) */}
        <div className="w-2/5 bg-white opacity-100 rounded-md ">
          <Select
            value={selectedDateTime}
            onValueChange={setSelectedDateTime}
            disabled={routesByCardSet.length === 0}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="조회하실 날짜를 선택해주세요" />
            </SelectTrigger>
            <SelectContent>
              {routesByCardSet.map((route) => {
                const date = new Date(route.studiedAt);
                const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
                  2,
                  "0",
                )}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(
                  2,
                  "0",
                )}:${String(date.getMinutes()).padStart(2, "0")}:${String(
                  date.getSeconds(),
                ).padStart(2, "0")}`;
                return (
                  <SelectItem key={route.studiedAt} value={route.studiedAt}>
                    {formatted}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 지도 */}
      <div id="map" className="absolute top-0 left-0 w-full h-full z-0" />
      {isMapLoaded && mapRef.current && (
        <CurrentLocation
          key={locationKey}
          map={mapRef.current}
          onUpdatePosition={handleLocationUpdate}
        />
      )}
      <CurrentLocationBtn onClick={() => setLocationKey((prev) => prev + 1)} />
    </div>
  );
};

export default MapView;
