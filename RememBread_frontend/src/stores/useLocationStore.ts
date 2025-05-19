import { create } from "zustand";

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  setLocation: (lat: number, lng: number) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  latitude: 0,
  longitude: 0,
  setLocation: (lat, lng) => set({ latitude: lat, longitude: lng }),
}));
