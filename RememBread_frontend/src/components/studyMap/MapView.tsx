import { useEffect, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { indexCardSet } from "@/types/indexCard";
import { searchMyCardSet, SearchMyCardSetParams } from "@/services/cardSet";
import { getRoutes, patchNotificationLocation } from "@/services/map";
import { toast } from "@/hooks/use-toast";
import useGeocode from "@/hooks/useGeocode";
import { Toaster } from "@/components/ui/toaster";
import CurrentLocation from "@/components/studyMap/CurrentLocation";
import CurrentLocationBtn from "@/components/studyMap/CurrentLocationBtn";
import AlertLocationBtn from "@/components/studyMap/AlertLocationBtn";
import AlertLocationDrawer from "@/components/studyMap/AlertLocationDrawer";
import MarkerStudyBread from "@/components/svgs/breads/MarkerStudyBread";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const MapView = () => {
  const [locationKey, setLocationKey] = useState<number>(0);
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
  const [curLatitude, setCurLatitude] = useState<number>(37.5665);
  const [curLongitude, setCurLongitude] = useState<number>(126.978);

  const [totalCount, setTotalCount] = useState<number>(0);
  const [myCardSets, setMyCardSets] = useState<indexCardSet[]>([]);
  const [routesByCardSet, setRoutesByCardSet] = useState<any[]>([]);
  const [selectedCardSet, setSelectedCardSet] = useState<number>(0);
  const [selectedDateTime, setSelectedDateTime] = useState<string>("");
  const [isAlarmEnabled, setIsAlarmEnabled] = useState<boolean>(true);
  const [isAlertDrawerOpen, setIsAlertDrawerOpen] = useState<boolean>(false);
  const [isManualMode, setIsManualMode] = useState<boolean>(false);
  const [manualAddress, setManualAddress] = useState<string>("");
  const [addressMarker, setAddressMarker] = useState<naver.maps.Marker | null>(null);

  const mapRef = useRef<naver.maps.Map | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const polylineRef = useRef<naver.maps.Polyline | null>(null);

  const { geocodeAddress } = useGeocode();

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
    const second = new Date(selectedDateTime).getSeconds();
    const stroke = lineColors[second % 10];
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }
    const breadSvg = ReactDOMServer.renderToStaticMarkup(<MarkerStudyBread />);
    const latlngs: naver.maps.LatLng[] = [];
    matched.route.forEach(([lng, lat]: [number, number]) => {
      const latlng = new naver.maps.LatLng(lat, lng);
      latlngs.push(latlng);
      const marker = new naver.maps.Marker({
        position: latlng,
        icon: {
          content: breadSvg,
          size: new naver.maps.Size(32, 32),
          anchor: new naver.maps.Point(16, 16),
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

  useEffect(() => {
    if (!isManualMode || !mapRef.current) return;

    const listener = naver.maps.Event.addListener(
      mapRef.current,
      "click",
      async (e: { coord: naver.maps.LatLng }) => {
        const lat = e.coord.lat();
        const lng = e.coord.lng();

        await patchNotificationLocation(lat, lng, isAlarmEnabled);
        setIsManualMode(false);
      },
    );

    return () => {
      naver.maps.Event.removeListener(listener);
    };
  }, [isManualMode, isAlarmEnabled]);

  const handleLocationUpdate = (lat: number, lng: number) => {
    setCurLatitude(lat);
    setCurLongitude(lng);
  };

  // 현재 위치로 위치 알람 설정
  const handleSetCurrentLocation = async () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const latitude = Number(pos.coords.latitude.toFixed(6));
      const longitude = Number(pos.coords.longitude.toFixed(6));

      try {
        await patchNotificationLocation(latitude, longitude, isAlarmEnabled);
        mapRef.current?.setCenter(new naver.maps.LatLng(latitude, longitude));

        toast({
          variant: "success",
          title: "알림 위치 설정 완료",
          description: "현재 위치로 알림 위치가 설정되었습니다.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "위치 설정 실패",
          description: "알림 위치 설정 중 오류가 발생했습니다.",
        });
      }
    });
  };

  // 위치 입력으로 위치 알람 설정
  const handleSetAddressLocation = async () => {
    if (!manualAddress) return;

    try {
      const result = await geocodeAddress(manualAddress);
      if (!result) {
        toast({
          variant: "destructive",
          title: "주소 검색 실패",
          description: "입력한 주소로 위치를 찾을 수 없습니다.",
        });
        return;
      }

      // 소수점 6자리까지 반올림 후 문자열 → 숫자 변환
      const lat = Number(result.lat.toFixed(6));
      const lng = Number(result.lng.toFixed(6));

      // 숫자 정수부 3자리 초과 방지 체크 (한국 범위 안에서는 거의 문제가 없음)
      if (
        Math.floor(Math.abs(lat)).toString().length > 3 ||
        Math.floor(Math.abs(lng)).toString().length > 3
      ) {
        toast({
          variant: "destructive",
          title: "좌표 범위 오류",
          description: "위도/경도가 허용된 범위를 초과합니다.",
        });
        return;
      }

      await patchNotificationLocation(lat, lng, isAlarmEnabled);

      const position = new naver.maps.LatLng(lat, lng);
      mapRef.current?.setCenter(position);

      if (addressMarker) {
        addressMarker.setMap(null);
      }

      const marker = new naver.maps.Marker({
        position,
        map: mapRef.current!,
        title: "알림 위치",
        icon: {
          content:
            '<div style="background-color: red; width: 10px; height: 10px; border-radius: 50%; z-index:999; position:absolute"></div>',
          size: new naver.maps.Size(10, 10),
          anchor: new naver.maps.Point(5, 5),
        },
      });

      setAddressMarker(marker);
      setIsAlertDrawerOpen(false);

      toast({
        variant: "success",
        title: "알림 위치 설정 완료",
        description: "입력한 주소로 위치 알림이 설정되었습니다.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "알림 설정 실패",
        description: "위치 알림 설정 중 문제가 발생했습니다.",
      });
      console.error(error);
    }
  };

  return (
    <div className="relative w-full" style={{ height: "calc(100vh - 7.5rem)" }}>
      <Toaster />
      <div className="absolute top-4 left-4 right-4 z-10 flex gap-2">
        <div className="w-3/5 bg-white opacity-100 rounded-md">
          <Select
            value={selectedCardSet ? String(selectedCardSet) : ""}
            onValueChange={(v) => setSelectedCardSet(Number(v))}
          >
            <SelectTrigger className="w-full">
              {selectedCardSet !== 0 ? (
                <span>
                  {myCardSets.find((set) => set.cardSetId === selectedCardSet)?.name}
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
            <SelectTrigger className="w-full pc:text-sm text-xs text-center">
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
        <>
          <CurrentLocation
            key={locationKey}
            map={mapRef.current}
            onUpdatePosition={handleLocationUpdate}
          />
          <CurrentLocationBtn onClick={() => setLocationKey((prev) => prev + 1)} />
          <AlertLocationBtn onClick={() => setIsAlertDrawerOpen(true)} />
        </>
      )}
      <AlertLocationDrawer
        open={isAlertDrawerOpen}
        onOpenChange={setIsAlertDrawerOpen}
        isEnabled={isAlarmEnabled}
        onToggleEnabled={setIsAlarmEnabled}
        onSetCurrentLocation={handleSetCurrentLocation}
        onSetAddressLocation={handleSetAddressLocation}
        manualAddress={manualAddress}
        setManualAddress={setManualAddress}
      />
    </div>
  );
};

export default MapView;
