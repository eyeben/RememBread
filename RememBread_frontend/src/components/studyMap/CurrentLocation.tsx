import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

interface Props {
  map: naver.maps.Map | null;
  onUpdatePosition?: (lat: number, lng: number) => void;
}

const CurrentLocation = ({ map, onUpdatePosition }: Props) => {
  useEffect(() => {
    if (!map) return;

    let marker: naver.maps.Marker | null = null;
    let watchId: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let received = false;
    let isAlerted = false;

    const updatePosition = (lat: number, lng: number) => {
      const latlng = new naver.maps.LatLng(lat, lng);

      onUpdatePosition?.(lat, lng);

      if (!marker) {
        marker = new naver.maps.Marker({
          position: latlng,
          map,
          title: "현재 위치",
          icon: {
            content: `
              <div style="position: relative; width: 20px; height: 20px;">
                <div style="
                  position: absolute;
                  width: 20px;
                  height: 20px;
                  background-color: #3B82F6;
                  border: 2px solid white;
                  border-radius: 50%;
                  z-index: 2;
                  box-shadow: 0 0 6px rgba(59, 130, 246, 0.8);
                "></div>
                <div style="
                  position: absolute;
                  width: 20px;
                  height: 20px;
                  background-color: rgba(59, 130, 246, 0.4);
                  border-radius: 50%;
                  animation: pulseRing 1.5s infinite ease-out;
                  z-index: 1;
                "></div>
              </div>
              <style>
                @keyframes pulseRing {
                  0% {
                    transform: scale(1);
                    opacity: 0.6;
                  }
                  100% {
                    transform: scale(2.5);
                    opacity: 0;
                  }
                }
              </style>
            `,
            size: new naver.maps.Size(20, 20),
            anchor: new naver.maps.Point(10, 10),
          },
        });
      } else {
        marker.setPosition(latlng);
      }

      map.setCenter(latlng);
      map.setZoom(15);
      received = true;
    };

    const fallbackWatch = () => {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          updatePosition(pos.coords.latitude, pos.coords.longitude);
          if (watchId !== null) navigator.geolocation.clearWatch(watchId);
        },
        (err) => {
          console.error("📛 watchPosition 실패:", err);
          if (!received && !isAlerted) {
            isAlerted = true;
            toast({
              title: "위치 정보를 가져올 수 없습니다.",
              description: "잠시 후 다시 시도해주세요.",
              variant: "destructive",
            });
          }
        },
        {
          enableHighAccuracy: false,
          maximumAge: 0,
          timeout: 10000,
        },
      );
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updatePosition(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        console.warn("⚠️ getCurrentPosition 실패. fallback 시작:", err);
        fallbackWatch();
      },
      {
        enableHighAccuracy: false,
        timeout: 3000,
        maximumAge: 0,
      },
    );

    // 만약 fallback에서도 위치 못 받으면 알려주기
    timeoutId = setTimeout(() => {
      if (!received && !isAlerted) {
        isAlerted = true;
        toast({
          title: "위치 정보를 가져올 수 없습니다.",
          description: "잠시 후 다시 시도해주세요.",
          variant: "destructive",
        });
        if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      }
    }, 10000);

    return () => {
      if (marker) marker.setMap(null);
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      if (timeoutId !== null) clearTimeout(timeoutId);
    };
  }, [map, onUpdatePosition]);

  return null;
};

export default CurrentLocation;
