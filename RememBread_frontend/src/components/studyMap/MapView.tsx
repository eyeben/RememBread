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
  const [curLatitude, setCurLatitude] = useState(37.5665);
  const [curLongitude, setCurLongitude] = useState(126.978);
  const [locationKey, setLocationKey] = useState(0);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const [myCardSets, setMyCardSets] = useState<indexCardSet[]>([]);
  const [routesByCardSet, setRoutesByCardSet] = useState<any[]>([]);
  const [selectedCardSet, setSelectedCardSet] = useState<number>(0);
  const [selectedDateTime, setSelectedDateTime] = useState<string>("");
  const [totalCount, setTotalCount] = useState<number>(0);

  const mapRef = useRef<naver.maps.Map | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const polylineRef = useRef<naver.maps.Polyline | null>(null);

  const lineColors = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#6366F1",
    "#EC4899",
    "#0EA5E9",
    "#8B5CF6",
    "#14B8A6",
    "#F43F5E",
  ];

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

  useEffect(() => {
    if (!selectedCardSet) return;

    const fetchRoutes = async () => {
      try {
        setRoutesByCardSet([]);
        setTotalCount(0);

        markersRef.current.forEach((m) => m.setMap(null));
        markersRef.current = [];

        if (polylineRef.current) {
          polylineRef.current.setMap(null);
          polylineRef.current = null;
        }

        setSelectedDateTime("");

        const { result } = await getRoutes(selectedCardSet, 0, 10);
        setRoutesByCardSet(result.routes);
        setTotalCount(result.total);
      } catch (err) {
        console.error("학습 이력 조회 실패:", err);
      }
    };

    fetchRoutes();
  }, [selectedCardSet]);

  useEffect(() => {
    if (!mapRef.current || !selectedDateTime) return;

    const matched = routesByCardSet.find((r) => r.studiedAt === selectedDateTime);
    if (!matched) return;

    // 색상 결정: 초(second)의 마지막 자리 숫자로 색 선택
    const second = new Date(selectedDateTime).getSeconds();
    const lastDigit = second % 10;
    const stroke = lineColors[lastDigit];

    // 기존 마커/선 제거
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    const breadSvg = ReactDOMServer.renderToStaticMarkup(<MarkerStudyBread />);
    const size = 32;

    const latlngs: naver.maps.LatLng[] = [];

    matched.route.forEach((coords: [number, number]) => {
      const [lng, lat] = coords;
      const latlng = new naver.maps.LatLng(lat, lng);
      latlngs.push(latlng);

      const marker = new naver.maps.Marker({
        position: latlng,
        icon: {
          content: breadSvg,
          size: new naver.maps.Size(size, size),
          anchor: new naver.maps.Point(size / 2, size / 2),
        },
        map: mapRef.current!,
      });

      markersRef.current.push(marker);
    });

    polylineRef.current = new naver.maps.Polyline({
      map: mapRef.current!,
      path: latlngs,
      strokeColor: stroke,
      strokeWeight: 10,
      strokeOpacity: 0.7,
      strokeStyle: "solid",
      strokeLineCap: "round",
      strokeLineJoin: "round",
    });
  }, [selectedDateTime]);

  useEffect(() => {
    const mapElement = document.getElementById("map");
    if (!mapElement) return;

    if (!mapRef.current) {
      mapRef.current = new naver.maps.Map(mapElement, {
        center: new naver.maps.LatLng(curLatitude, curLongitude),
        zoom: 15,
        zoomControl: false,
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

  useEffect(() => {
    if (!mapRef.current || !selectedCardSet || !selectedDateTime) return;

    const matched = routesByCardSet.find((r) => r.studiedAt === selectedDateTime);
    if (!matched || !matched.route.length) return;

    const [lng, lat] = matched.route[0];
    mapRef.current.setCenter(new naver.maps.LatLng(lat, lng));
  }, [selectedCardSet, selectedDateTime]);

  const handleLocationUpdate = (lat: number, lng: number) => {
    setCurLatitude(lat);
    setCurLongitude(lng);
  };

  return (
    <div className="relative w-full" style={{ height: "calc(100vh - 7.5rem)" }}>
      <div className="absolute top-4 left-4 right-4 z-10 flex gap-2">
        <div className="w-3/5 bg-white opacity-100 rounded-md">
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

        <div className="w-2/5 bg-white opacity-100 rounded-md">
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
