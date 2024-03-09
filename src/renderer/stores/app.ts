import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type TabName =
  | "Test Sequencer"
  | "Visual Python Script"
  | "Hardware Devices";

type State = {
  showWelcomeScreen: boolean;
  isEnvVarModalOpen: boolean;
  isDepManagerModalOpen: boolean;
  activeTab: TabName;
};

type Actions = {
  setShowWelcomeScreen: (val: boolean) => void;
  setIsEnvVarModalOpen: (val: boolean) => void;
  setIsDepManagerModalOpen: (val: boolean) => void;
  setActiveTab: (tab: TabName) => void;
};

export const useAppStore = create<State & Actions>()(
  immer((set) => ({
    showWelcomeScreen: true,
    setShowWelcomeScreen: (val) =>
      set((state) => {
        state.showWelcomeScreen = val;
      }),

    isEnvVarModalOpen: false,
    isDepManagerModalOpen: false,
    setIsEnvVarModalOpen: (val) =>
      set((state) => {
        state.isEnvVarModalOpen = val;
      }),
    setIsDepManagerModalOpen: (val) =>
      set((state) => {
        state.isDepManagerModalOpen = val;
      }),

    activeTab: "Visual Python Script" as TabName,
    setActiveTab: (tab) =>
      set((state) => {
        state.activeTab = tab;
      }),
  })),
);
