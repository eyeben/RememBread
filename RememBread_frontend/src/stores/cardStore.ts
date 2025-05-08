import { create } from "zustand";
import { indexCard } from "@/types/indexCard";
import { createEmptyCard } from "@/utils/createEmptyCard";

interface CardStore {
  cardSet: indexCard[];
  setCardSet: (cards: indexCard[]) => void;
  resetCardSet: () => void;
}

export const useCardStore = create<CardStore>((set) => ({
  cardSet: [createEmptyCard()],
  setCardSet: (cards) => set({ cardSet: cards }),
  resetCardSet: () => set({ cardSet: [createEmptyCard()] }),
}));
