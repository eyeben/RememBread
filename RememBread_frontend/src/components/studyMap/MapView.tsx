import { useEffect, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { getRoutes } from "@/services/map";
import CurrentLocationBtn from "@/components/studyMap/CurrentLocationBtn";
import CurrentLocation from "@/components/studyMap/CurrentLocation";
import MarkerStudyBread from "@/components/svgs/breads/MarkerStudyBread";

const MapView = () => {
  const [curLatitude, setCurLatitude] = useState<number>(37.5665);
  const [curLongitude, setCurLongitude] = useState<number>(126.978);
  const [locationKey, setLocationKey] = useState<number>(0);
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);

  const mapRef = useRef<naver.maps.Map | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);

  // 학습 경로 마커 렌더링 함수
  const fetchStudyRoutes = async () => {
    if (!mapRef.current) return;

    try {
      const { result } = await getRoutes(128, 0, 10);

      const breadSvg = ReactDOMServer.renderToStaticMarkup(<MarkerStudyBread />);

      result.routes.forEach((routeData: any) => {
        routeData.route.forEach((coords: [number, number]) => {
          const [lng, lat] = coords;

          const marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(lat, lng),
            icon: {
              content: breadSvg,
              size: new naver.maps.Size(32, 32),
              anchor: new naver.maps.Point(16, 16),
            },
            map: mapRef.current!,
          });

          markersRef.current.push(marker);
        });
      });
    } catch (err) {
      console.error("학습 경로 마커 가져오기 실패", err);
    }
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

      setIsMapLoaded(true);
    }

    // 최초 실행 시 마커 표시
    fetchStudyRoutes();
  }, []);

  const handleLocationUpdate = (lat: number, lng: number) => {
    setCurLatitude(lat);
    setCurLongitude(lng);
  };

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
        }}
      />
    </div>
  );
};

export default MapView;
