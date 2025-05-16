import { useEffect, useState } from "react";

interface Location {
  latitude: number;
  longitude: number;
}

export const useCurrentLocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation을 지원하지 않는 브라우저입니다.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6)),
        });
        setError(null);
      },
      (err) => {
        setError("위치 정보를 가져올 수 없습니다.");
        console.error("Geolocation error:", err);
      },
      {
        enableHighAccuracy: false, // 셀룰러 방식
        timeout: 10000,
        maximumAge: 10000,
      },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { location, error };
};
