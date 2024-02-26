import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  isEditMode: boolean;
};

type Actions = {
  setIsEditMode: (val: boolean) => void;
};

export const useFlowchartStore = create<State & Actions>()(
  immer((set) => ({
    isEditMode: false,
    setIsEditMode: (val) =>
      set((state) => {
        state.isEditMode = val;
      }),
  })),
);
