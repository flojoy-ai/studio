import { create } from "zustand";
import { immer } from "zustand/middleware/immer";


type State = {
  isImportTestModalOpen: boolean;
  isCreateProjectModalOpen: boolean;
};

type Actions = {
  setIsImportTestModalOpen: (val: boolean) => void;
  setIsCreateProjectModalOpen: (val: boolean) => void;
};


export const useModalStore = create<State & Actions>()(
  immer((set) => ({
    isImportTestModalOpen: false,
    setIsImportTestModalOpen: (val) =>
      set((state) => {
        state.isImportTestModalOpen = val;
      }),

    isCreateProjectModalOpen: false,
    setIsCreateProjectModalOpen: (val) =>
      set((state) => {
      state.isCreateProjectModalOpen = val;
      }),
  })),
);
