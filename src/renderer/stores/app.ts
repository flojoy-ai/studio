import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type Position = { x: number; y: number };

export type TabName =
  | "Test Sequencer"
  | "Visual Python Script"
  | "Hardware Devices";

type State = {
  showWelcomeScreen: boolean;
  centerPosition: Position;
  isEnvVarModalOpen: boolean;
  isDepManagerModalOpen: boolean;
  activeTab: TabName;
};

type Actions = {
  setShowWelcomeScreen: (val: boolean) => void;
  setCenterPosition: (position: Position) => void;
  setIsEnvVarModalOpen: (val: boolean) => void;
  setIsDepManagerModalOpen: (val: boolean) => void;
  setActiveTab: (tab: TabName) => void;
};

export const useAppStore = create<State & Actions>()(
  immer((set) => ({
    showWelcomeScreen: true,
    centerPosition: { x: 0, y: 0 },
    setShowWelcomeScreen: (val) =>
      set((state) => {
        state.showWelcomeScreen = val;
      }),
    setCenterPosition: (position) =>
      set((state) => {
        state.centerPosition = position;
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

    activeTab: "Test Sequencer" as TabName,
    setActiveTab: (tab) =>
      set((state) => {
        state.activeTab = tab;
      }),
  })),
);
