import { create } from 'zustand';

interface GameState {
  memoryScore: number;
  setMemoryScore: (score: number) => void;
  resetMemoryScore: () => void;
}

const useGameStore = create<GameState>((set) => ({
  memoryScore: 0,
  setMemoryScore: (score) => set({ memoryScore:score }),
  resetMemoryScore: () => set({ memoryScore: 0 }),
}));

export default useGameStore; 