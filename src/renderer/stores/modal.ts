import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  // Modals
  isImportTestModalOpen: boolean;
  isCreateProjectModalOpen: boolean;
  isErrorModalOpen: boolean;
  isRenameTestModalOpen: boolean;
  // Data
  errorModalMessage: string;
  renameTestId: string | null;
};

type Actions = {
  // Modals
  setIsImportTestModalOpen: (val: boolean) => void;
  setIsCreateProjectModalOpen: (val: boolean) => void;
  setIsErrorModalOpen: (val: boolean) => void;
  setIsRenameTestModalOpen: (val: boolean, testId: string | null) => void;
  // Data
  setErrorModalMessage: (val: string) => void;
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

    isErrorModalOpen: false,
    setIsErrorModalOpen: (val) =>
      set((state) => {
        state.isErrorModalOpen = val;
      }),

    errorModalMessage: "No error message provided.",
    setErrorModalMessage: (val) =>
      set((state) => {
        state.errorModalMessage = val;
      }),

    isRenameTestModalOpen: false,
    renameTestId: "",
    setIsRenameTestModalOpen: (val, testId) =>
      set((state) => {
        state.isRenameTestModalOpen = val;
        state.renameTestId = testId;
      }),
  })),
);
