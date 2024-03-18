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
  openErrorModal: (message: string) => void;
  setIsRenameTestModalOpen: (val: boolean) => void;
  openRenameTestModal: (testId: string) => void;
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
    errorModalMessage: "No error message provided.",
    setIsErrorModalOpen: (val) =>
      set((state) => {
        state.isErrorModalOpen = val;
      }),
    openErrorModal: (message) =>
      set((state) => {
        state.isErrorModalOpen = true;
        state.errorModalMessage = message;
      }),

    isRenameTestModalOpen: false,
    renameTestId: "",
    setIsRenameTestModalOpen: (val) =>
      set((state) => {
        state.isRenameTestModalOpen = val;
        state.renameTestId = null;
      }),
    openRenameTestModal: (testId) =>
      set((state) => {
        state.isRenameTestModalOpen = true;
        state.renameTestId = testId;
      }),
  })),
);
