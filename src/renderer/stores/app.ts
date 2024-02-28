import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type Position = { x: number; y: number };
type State = {
  showWelcomeScreen: boolean;
  centerPosition: Position;
};

type Actions = {
  setShowWelcomeScreen: (val: boolean) => void;
  setCenterPosition: (position: Position) => void;
};

export const useAppStore = create<State & Actions>()(
  immer((set) => ({
    showWelcomeScreen: true as boolean,
    centerPosition: { x: 0, y: 0 },
    setShowWelcomeScreen: (val) =>
      set((state) => {
        state.showWelcomeScreen = val;
      }),
    setCenterPosition: (position) =>
      set((state) => {
        state.centerPosition = position;
      }),
  })),
);
