import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  isEditMode: boolean;
  nodeParamChanged: boolean;
  hasUnsavedChanges: boolean;
};

type Actions = {
  setIsEditMode: (val: boolean) => void;
  markNodeParamChanged: () => void;
  resetNodeParamChanged: () => void;
  markHasUnsavedChanges: () => void;
  resetHasUnsavedChanges: () => void;
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

    hasUnsavedChanges: false,
    markHasUnsavedChanges: () => {
      set({ hasUnsavedChanges: true });
      if ("api" in window) {
        window.api.setUnsavedChanges(true);
      }
    },
    resetHasUnsavedChanges: () => {
      set({ hasUnsavedChanges: false });
      if ("api" in window) {
        window.api.setUnsavedChanges(false);
      }
    },
  })),
);
