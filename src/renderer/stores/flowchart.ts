import { XYPosition } from "reactflow";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  isEditMode: boolean;
  centerPosition: XYPosition;
  nodeParamChanged: boolean;
};

type Actions = {
  setIsEditMode: (val: boolean) => void;
  setCenterPosition: (position: XYPosition) => void;
  markNodeParamChanged: () => void;
  resetNodeParamChanged: () => void;
};

export const useFlowchartStore = create<State & Actions>()(
  immer((set) => ({
    isEditMode: false,
    setIsEditMode: (val) =>
      set((state) => {
        state.isEditMode = val;
      }),

    centerPosition: { x: 0, y: 0 },
    setCenterPosition: (position) =>
      set((state) => {
        state.centerPosition = position;
      }),

    nodeParamChanged: false,
    markNodeParamChanged: () => set({ nodeParamChanged: true }),
    resetNodeParamChanged: () => set({ nodeParamChanged: false }),
  })),
);
