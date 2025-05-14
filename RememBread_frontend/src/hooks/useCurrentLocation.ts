import { useEffect, useState } from "react";

interface Location {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
}

const useCurrentLocation = (): Location => {
  const [location, setLocation] = useState<Location>({
    latitude: null,
    longitude: null,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: "Geolocation을 지원하지 않는 브라우저입니다.",
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (err) => {
        setLocation((prev) => ({
          ...prev,
          error: err.message,
        }));
      },
    );
  }, []);

  return location;
};

export default useCurrentLocation;
