import type { Feeling } from "@/hooks/useMood";
import { create } from "zustand";

type MoodState = {
  current?: Feeling;
  updatedAt?: number;
  setMood: (feeling: Feeling) => void;
  clearMood: () => void;
};

export const useMoodStore = create<MoodState>((set) => ({
  current: undefined,
  updatedAt: undefined,
  setMood: (feeling) => set({ current: feeling, updatedAt: Date.now() }),
  clearMood: () => set({ current: undefined, updatedAt: undefined }),
}));
