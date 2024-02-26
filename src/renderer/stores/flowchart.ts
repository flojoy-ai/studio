import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  isEditMode: boolean;
  runningNodeId: string | null;
};

type Actions = {
  setIsEditMode: (val: boolean) => void;
  setRunningNodeId: (val: string) => void;
};

export const useFlowchartStore = create<State & Actions>()(
  immer((set) => ({
    isEditMode: false,
    setIsEditMode: (val) =>
      set((state) => {
        state.isEditMode = val;
      }),

    runningNodeId: null,
    setRunningNodeId: (val) => set({ runningNodeId: val }),

    failedNodes: {},
  })),
);
