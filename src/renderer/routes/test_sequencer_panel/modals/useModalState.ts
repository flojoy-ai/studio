import { create } from "zustand";

type State = {
  inputsForGeneratedTestModalState: boolean;
  placeholdersForGeneratedTest: string[];
  callbackForInputsForGeneratedTestModal: (placeholderValues: string[]) => void;
};

type Actions = {
  showInputsForGeneratedTestModal: () => void;
  hideInputsForGeneratedTestModal: () => void;
  setInputsForGeneratedTestModal: () => void;
  setPlaceholdersForGeneratedTest: (placeholders: string[]) => void;
  setCallbackForInputsForGeneratedTestModal: (
    callback: (placeholderValues: string[]) => void,
  ) => void;
};

export const useModalState = create<State & Actions>()((set) => ({
  inputsForGeneratedTestModalState: true,
  placeholdersForGeneratedTest: [],
  callbackForInputsForGeneratedTestModal: () => {},
  showInputsForGeneratedTestModal: () =>
    set({ inputsForGeneratedTestModalState: true }),
  hideInputsForGeneratedTestModal: () =>
    set({
      inputsForGeneratedTestModalState: false,
    }),
  setInputsForGeneratedTestModal: (isOpen) =>
    set({
      inputsForGeneratedTestModalState: isOpen,
    }),
  setPlaceholdersForGeneratedTest: (placeholdersForGeneratedTest) =>
    set({
      placeholdersForGeneratedTest: placeholdersForGeneratedTest,
    }),
  setCallbackForInputsForGeneratedTestModal: (callbackFn) =>
    set({
      callbackForInputsForGeneratedTestModal: callbackFn,
    }),
}));
