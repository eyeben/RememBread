import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactDOMServer from "react-dom/server";
import { Bell, LocateFixed, MapPin } from "lucide-react";
import { indexCardSet } from "@/types/indexCard";
import { currentLocationIcon } from "@/utils/currentLocationIcon";
import { getRoutes, patchNotificationLocation } from "@/services/map";
import { searchMyCardSet, SearchMyCardSetParams } from "@/services/cardSet";
import { toast } from "@/hooks/use-toast";
import useGeocode from "@/hooks/useGeocode";
import { Toaster } from "@/components/ui/toaster";
import CurrentLocationBtn from "@/components/studyMap/CurrentLocationBtn";
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
  const [isPinMode, setIsPinMode] = useState<boolean>(false);
  const [isAlertOptionsOpen, setIsAlertOptionsOpen] = useState<boolean>(false);

  const mapRef = useRef<naver.maps.Map | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const polylineRef = useRef<naver.maps.Polyline | null>(null);
  const currentLocationMarkerRef = useRef<naver.maps.Marker | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const { geocodeAddress } = useGeocode();
  const location = useLocation();

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

  // 시작 시 현재 위치로 가기
  useEffect(() => {
    if (!mapRef.current) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        const position = new naver.maps.LatLng(lat, lng);
        mapRef.current?.setCenter(position);
        setCurLatitude(lat);
        setCurLongitude(lng);

        // 마커 생성 추가
        if (currentLocationMarkerRef.current) {
          currentLocationMarkerRef.current.setPosition(position);
        } else {
          const marker = new naver.maps.Marker({
            position,
            map: mapRef.current!,
            title: "현재 위치",
            icon: currentLocationIcon(20),
          });
          currentLocationMarkerRef.current = marker;
        }

        navigator.geolocation.clearWatch(watchId);
      },
      (err) => {
        console.warn("초기 위치 설정 실패:", err);
      },
      {
        enableHighAccuracy: false,
        timeout: 3000,
        maximumAge: 10000,
      },
    );
  }, [isMapLoaded]);

  // MapView 경로일 때마다 위치 마커 강제 리렌더링
  useEffect(() => {
    if (location.pathname.includes("map")) {
      setLocationKey((prev) => prev + 1);
    }
  }, [location.pathname]);

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

  // 현재 위치로 위치 알람 설정
  const handleSetCurrentLocation = () => {
    let isAlerted = false;

    const updatePosition = (lat: number, lng: number) => {
      setCurLatitude(lat);
      setCurLongitude(lng);
      const position = new naver.maps.LatLng(lat, lng);
      mapRef.current?.setCenter(position);

      if (currentLocationMarkerRef.current) {
        currentLocationMarkerRef.current.setPosition(position);
      } else {
        const marker = new naver.maps.Marker({
          position,
          map: mapRef.current!,
          title: "현재 위치",
          icon: currentLocationIcon(20),
        });
        currentLocationMarkerRef.current = marker;
      }
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        updatePosition(pos.coords.latitude, pos.coords.longitude);
        if (watchIdRef.current !== null) {
          navigator.geolocation.clearWatch(watchIdRef.current);
          watchIdRef.current = null;
        }
      },
      (err) => {
        if (!isAlerted) {
          isAlerted = true;
          toast({
            title: "위치 정보를 가져오지 못했어요.",
            description: "잠시 후 다시 시도해주세요.",
            variant: "destructive",
          });
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 3000,
        maximumAge: 10000,
      },
    );
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
        icon: currentLocationIcon(20),
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

  // 핀 위치 기반으로 알람 설정
  const handleSetPinLocation = async () => {
    if (!mapRef.current) return;

    const center = mapRef.current.getCenter() as naver.maps.LatLng;
    const lat = Number(center.lat().toFixed(6));
    const lng = Number(center.lng().toFixed(6));

    try {
      await patchNotificationLocation(lat, lng, isAlarmEnabled);
      setIsAlertDrawerOpen(false);
      setIsPinMode(false);

      // 기존 마커 제거
      if (addressMarker) {
        addressMarker.setMap(null);
      }

      // 새로운 마커 생성 및 표시
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(lat, lng),
        map: mapRef.current,
        title: "알림 위치",
        icon: {
          content: `
            <div style="
              width: 40px;
              height: 40px;
              background-color: white;
              border: 2px solid #ffaa64;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
              animation: pulse-ring 2s infinite;
            ">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#ffaa64" viewBox="0 0 24 24">
                <path d="M15 17h5l-1.4-1.4a2 2 0 0 1-.6-1.4v-3a6 6 0 0 0-4-5.7V5a2 2 0 1 0-4 0v.5A6 6 0 0 0 6 11v3a2 2 0 0 1-.6 1.4L4 17h5m6 0v1a3 3 0 1 1-6 0v-1" />
              </svg>
            </div>
            <style>
              @keyframes pulse-ring {
                0% {
                  box-shadow: 0 0 0 0 rgba(255,170,100, 0.6);
                }
                70% {
                  box-shadow: 0 0 0 10px rgba(255,170,100, 0);
                }
                100% {
                  box-shadow: 0 0 0 0 rgba(255,170,100, 0);
                }
              }
            </style>
          `,
          size: new naver.maps.Size(40, 40),
          anchor: new naver.maps.Point(20, 20),
        },
      });

      setAddressMarker(marker);

      toast({
        variant: "success",
        title: "알림 위치 설정 완료",
        description: "알림이 설정되었습니다.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "알림 설정 실패",
        description: "위치 설정 중 문제가 발생했습니다.",
      });
    }
  };

  const handleSetManualLocation = () => {};

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
          {/* <CurrentLocation
            key={locationKey}
            map={mapRef.current}
            onUpdatePosition={handleLocationUpdate}
          /> */}
          <div className="flex flex-col items-center space-y-1 absolute bottom-28 left-5 z-20">
            <CurrentLocationBtn onClick={handleSetCurrentLocation} />
            <span className="text-xs text-white bg-primary-600/90 px-2 py-1 rounded-md shadow">
              현재 위치
            </span>
          </div>

          <div className="absolute bottom-6 left-5 z-20 flex items-end gap-2">
            <div className="flex flex-col items-center space-y-1">
              <button
                className="bg-white text-primary-500 border border-primary-500 shadow-xl w-12 h-12 rounded-full flex items-center justify-center hover:bg-primary-100 transition"
                onClick={() => {
                  setIsAlertOptionsOpen((prev) => {
                    const next = !prev;
                    if (!next) {
                      setIsPinMode(false); // 옵션 닫을 때 핀 모드도 종료
                    }
                    return next;
                  });
                }}
              >
                <Bell className="w-6 h-6" />
              </button>
              <span className="text-xs text-white bg-primary-600/90 px-2 py-1 rounded-md shadow">
                알림 설정
              </span>
            </div>

            {isAlertOptionsOpen && (
              <>
                <div className="flex flex-col items-center space-y-1">
                  <button
                    className="bg-white text-primary-500 border border-primary-500 shadow-xl w-12 h-12 rounded-full flex items-center justify-center hover:bg-primary-100 transition"
                    onClick={() => {
                      setIsPinMode(true);
                      setIsAlertOptionsOpen(false);
                    }}
                  >
                    <MapPin className="w-6 h-6" />
                  </button>
                  <span className="text-xs text-white bg-gray-600/80 px-2 py-1 rounded-md shadow">
                    직접 설정
                  </span>
                </div>

                <div className="flex flex-col items-center space-y-1">
                  <button
                    className="bg-white text-primary-500 border border-primary-500 shadow-xl w-12 h-12 rounded-full flex items-center justify-center hover:bg-primary-100 transition"
                    onClick={() => {
                      setIsAlertDrawerOpen(true);
                      setIsAlertOptionsOpen(false);
                    }}
                  >
                    <LocateFixed className="w-6 h-6" />
                  </button>
                  <span className="text-xs text-white bg-gray-600/80 px-2 py-1 rounded-md shadow">
                    주소 입력
                  </span>
                </div>
              </>
            )}
          </div>
        </>
      )}
      {isPinMode && (
        <>
          {/* 중앙 핀 아이콘 */}
          <div className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
            <MapPin className="w-10 h-16 text-negative-600 drop-shadow-md" />
          </div>

          {/* 하단 저장/취소 버튼 */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-4">
            <button
              className="px-5 py-2.5 bg-gray-200 text-gray-800 font-semibold text-sm rounded-lg shadow-md hover:bg-gray-300 transition"
              onClick={() => setIsPinMode(false)}
            >
              취소
            </button>
            <button
              className="px-5 py-2.5 bg-primary-500 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-primary-600 transition"
              onClick={handleSetPinLocation}
            >
              알림 설정
            </button>
          </div>
        </>
      )}

      <AlertLocationDrawer
        open={isAlertDrawerOpen}
        onOpenChange={setIsAlertDrawerOpen}
        isEnabled={isAlarmEnabled}
        onToggleEnabled={setIsAlarmEnabled}
        onSetCurrentLocation={handleSetCurrentLocation}
        onSetAddressLocation={handleSetAddressLocation}
        onSetManualLocation={handleSetManualLocation}
        onSetPinLocation={handleSetPinLocation}
        isPinMode={isPinMode}
        setIsPinMode={setIsPinMode}
        manualAddress={manualAddress}
        setManualAddress={setManualAddress}
      />
    </div>
  );
};

export default MapView;
