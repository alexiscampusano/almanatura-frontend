import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const MIN_FONT_SCALE = 0.9;
const MAX_FONT_SCALE = 1.3;
const FONT_SCALE_STEP = 0.1;

type AccessibilityState = {
  fontSizeScale: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
};

const clampFontScale = (value: number) =>
  Math.max(MIN_FONT_SCALE, Math.min(MAX_FONT_SCALE, Number(value.toFixed(2))));

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set, get) => ({
      fontSizeScale: 1,
      increaseFontSize: () =>
        set({
          fontSizeScale: clampFontScale(get().fontSizeScale + FONT_SCALE_STEP),
        }),
      decreaseFontSize: () =>
        set({
          fontSizeScale: clampFontScale(get().fontSizeScale - FONT_SCALE_STEP),
        }),
      resetFontSize: () => set({ fontSizeScale: 1 }),
    }),
    {
      name: "alma-natura-accessibility",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ fontSizeScale: state.fontSizeScale }),
    },
  ),
);
