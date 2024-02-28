import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  isEditMode: boolean;
  nodeParamChanged: boolean;
};

type Actions = {
  setIsEditMode: (val: boolean) => void;
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

    nodeParamChanged: false,
    markNodeParamChanged: () => set({ nodeParamChanged: true }),
    resetNodeParamChanged: () => set({ nodeParamChanged: false }),
  })),
);
