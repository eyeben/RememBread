import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  setAuth: (token: string) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  setAuth: (token) => set({ accessToken: token }),
  clearAuth: () => set({ accessToken: null }),
}));

export default useAuthStore; 