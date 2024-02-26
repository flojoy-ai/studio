import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  isEditMode: boolean;
  runningNodeId: string | null;
  nodeParamChanged: boolean;
};

type Actions = {
  setIsEditMode: (val: boolean) => void;
  setRunningNodeId: (val: string) => void;
  setNodeParamChanged: (val: boolean) => void;
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

    nodeParamChanged: false,
    setNodeParamChanged: (val) => set({ nodeParamChanged: val }),
  })),
);
