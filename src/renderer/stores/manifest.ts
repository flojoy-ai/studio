import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  standardBlocksManifest: any;
  customBlocksManifest: any;
  standardBlocksMetadata: any;
  customBlocksMetadata: any;
};

type Actions = {
  setStandardBlocksManifest: (val: any) => void;
  setCustomBlocksManifest: (val: any) => void;
  setStandardBlocksMetadata: (val: any) => void;
  setCustomBlocksMetadata: (val: any) => void;
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
