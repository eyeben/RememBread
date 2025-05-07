import { create } from 'zustand';

interface GameState {
  memoryScore: number;
  setMemoryScore: (score: number) => void;
  resetMemoryScore: () => void;
  compareScore: number;
  setCompareScore: (score: number) => void;
  resetCompareScore: () => void;
}

const useGameStore = create<GameState>((set) => ({
  memoryScore: 0,
  setMemoryScore: (score) => set({ memoryScore: score }),
  resetMemoryScore: () => set({ memoryScore: 0 }),
  compareScore: 0,
  setCompareScore: (score) => set({ compareScore: score }),
  resetCompareScore: () => set({ compareScore: 0 }),
}));

export default useGameStore; 