import { useEffect, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import CurrentLocationBtn from "@/components/studyMap/CurrentLocationBtn";
import CurrentLocation from "@/components/studyMap/CurrentLocation";
import { LocateFixed } from "lucide-react";

type Props = {
  searchParams: {
    keyword: string;
    categoryId: number | null;
    startDate: number | null;
    endDate: number | null;
  };
};

const MapView = ({ searchParams }: Props) => {
  const [curLatitude, setCurLatitude] = useState<number>(37.5665);
  const [curLongitude, setCurLongitude] = useState<number>(126.978);
  const [locationKey, setLocationKey] = useState<number>(0);
  const [lastZoomLevel, setLastZoomLevel] = useState<number | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [selectedDrawerMarker, setSelectedDrawerMarker] = useState<{
    geohashCode: string;
    id: string;
    address?: string;
  } | null>(null);
  const mapRef = useRef<naver.maps.Map | null>(null); // Naver 지도 인스턴스 (naver.maps.Map) 저장
  const searchParamsRef = useRef(searchParams);
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const svgString = ReactDOMServer.renderToStaticMarkup(
    <LocateFixed className="w-full h-full text-primary-500" />,
  );

  const fetchMarkers = async (params = searchParams) => {
    if (!mapRef.current) return;

    const zoomLevel = mapRef.current.getZoom();
    const center = mapRef.current.getCenter() as naver.maps.LatLng;

    try {
      const data = await getMarkers({
        lat: center.lat(),
        lng: center.lng(),
        zoomLevel,
        keyword: params.keyword || null,
        categoryId: params.categoryId ?? null,
        startDate: params.startDate,
        endDate: params.endDate,
      });

      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];

      const newMarkers = data.map((marker: any) => {
        const markerInstance = new naver.maps.Marker({
          position: new naver.maps.LatLng(marker.latitude, marker.longitude),
          icon: {
            content: svgString,
            size: new naver.maps.Size(32, 32),
            anchor: new naver.maps.Point(16, 16),
          },
          map: mapRef.current!,
        });

        naver.maps.Event.addListener(markerInstance, "click", () => {
          const map = mapRef.current;
          const { latitude, longitude, geohashCode } = marker;

          if (map && map.getZoom() >= 5) {
            const triggerId = `marker-drawer-${geohashCode}-${Date.now()}`;

            naver.maps.Service.reverseGeocode(
              {
                coords: new naver.maps.LatLng(latitude, longitude),
                orders: [
                  naver.maps.Service.OrderType.ROAD_ADDR,
                  naver.maps.Service.OrderType.ADDR,
                ] as unknown as string,
              },
              (status, response) => {
                if (status !== naver.maps.Service.Status.OK) return;

                const address =
                  response.v2.address.roadAddress || response.v2.address.jibunAddress || "";

                setSelectedDrawerMarker({
                  geohashCode,
                  id: triggerId,
                  address,
                });

                setTimeout(() => {
                  const el = document.getElementById(triggerId);
                  el?.click();
                }, 0);
              },
            );
          } else {
            if (map) {
              map.setZoom(map.getZoom() + 1);
              map.setCenter(new naver.maps.LatLng(latitude, longitude));
            }
          }
        });

        return markerInstance;
      });

      markersRef.current = newMarkers;
    } catch (error) {
      // console.error("마커 가져오기 실패:", error);
    }
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
  
      .cluster-icon:hover .cluster-count {
        transform: scale(1.2);
      }
  
      .custom-marker:hover {
        transform: scale(1.1);
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);
  }, []);

  // 검색 조건 바뀌었을 때 마커 다시 불러오기
  useEffect(() => {
    if (isMapLoaded) {
      fetchMarkers(searchParams);
    }
  }, [searchParams]);

  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  const handleLocationUpdate = (lat: number, lng: number) => {
    setCurLatitude(lat);
    setCurLongitude(lng);
  };

  useEffect(() => {
    const mapElement = document.getElementById("map");
    if (!mapElement) return;

    if (!mapRef.current) {
      mapRef.current = new naver.maps.Map(mapElement, {
        center: new naver.maps.LatLng(curLatitude, curLongitude),
        zoom: 15,
        zoomControl: true,
        zoomControlOptions: {
          style: naver.maps.ZoomControlStyle.SMALL,
          position: naver.maps.Position.TOP_RIGHT,
        },
      });

      mapRef.current.addListener("zoom_changed", () => {
        setIsClicked(false);
      });

      mapRef.current.addListener("idle", () => {
        const currentZoom = mapRef.current?.getZoom();

        // 줌 레벨이 바뀐 경우에만 fetchMarkers 호출
        if (currentZoom !== lastZoomLevel) {
          setLastZoomLevel(currentZoom ?? null);
          fetchMarkers(searchParamsRef.current);
        }
      });

      mapRef.current.addListener("dragstart", () => {
        setIsClicked(false);
      });

      setIsMapLoaded(true);
    }

    fetchMarkers(searchParams);
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const targetDivs = document.querySelectorAll("div");
      targetDivs.forEach((div) => {
        const style = div.getAttribute("style");
        if (
          style?.includes("width: 28px") &&
          style.includes("border: 1px solid rgb(68, 68, 68)") &&
          style.includes("z-index: 0")
        ) {
          div.style.display = "none";
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-full" style={{ height: "calc(100vh - 7.5rem)" }}>
      <div id="map" className="absolute top-0 left-0 w-full h-full z-0" />
      {isMapLoaded && mapRef.current && (
        <CurrentLocation
          key={locationKey}
          map={mapRef.current}
          onUpdatePosition={handleLocationUpdate}
        />
      )}

      <CurrentLocationBtn
        onClick={() => {
          setLocationKey((prev) => prev + 1);
          setIsClicked(true);
        }}
      />
    </div>
  );
};

export default MapView;
