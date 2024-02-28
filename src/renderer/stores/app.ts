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
  isKeyboardShortcutOpen: boolean;
  isEnvVarModalOpen: boolean;
  isBlockSettingsOpen: boolean;
  isDebugSettingsOpen: boolean;
  isEditorSettingsOpen: boolean;
  isDeviceSettingsOpen: boolean;
  isDepManagerModalOpen: boolean;
  activeTab: TabName;
};

type Actions = {
  setShowWelcomeScreen: (val: boolean) => void;
  setCenterPosition: (position: Position) => void;
  setIsKeyboardShortcutOpen: (val: boolean) => void;
  setIsEnvVarModalOpen: (val: boolean) => void;
  setIsBlockSettingsOpen: (val: boolean) => void;
  setIsDebugSettingsOpen: (val: boolean) => void;
  setIsEditorSettingsOpen: (val: boolean) => void;
  setIsDeviceSettingsOpen: (val: boolean) => void;
  setIsDepManagerModalOpen: (val: boolean) => void;
  setActiveTab: (tab: TabName) => void;
};

export const useAppStore = create<State & Actions>()(
  immer((set) => ({
    showWelcomeScreen: true as boolean,
    centerPosition: { x: 0, y: 0 },
    setShowWelcomeScreen: (val) =>
      set((state) => {
        state.showWelcomeScreen = val;
      }),
    setCenterPosition: (position) =>
      set((state) => {
        state.centerPosition = position;
      }),

    isKeyboardShortcutOpen: false as boolean,
    isEnvVarModalOpen: false as boolean,
    isBlockSettingsOpen: false as boolean,
    isDebugSettingsOpen: false as boolean,
    isEditorSettingsOpen: false as boolean,
    isDeviceSettingsOpen: false as boolean,
    isDepManagerModalOpen: false as boolean,
    setIsKeyboardShortcutOpen: (val) =>
      set((state) => {
        state.isKeyboardShortcutOpen = val;
      }),
    setIsEnvVarModalOpen: (val) =>
      set((state) => {
        state.isEnvVarModalOpen = val;
      }),
    setIsBlockSettingsOpen: (val) =>
      set((state) => {
        state.isBlockSettingsOpen = val;
      }),
    setIsDebugSettingsOpen: (val) =>
      set((state) => {
        state.isDebugSettingsOpen = val;
      }),
    setIsEditorSettingsOpen: (val) =>
      set((state) => {
        state.isEditorSettingsOpen = val;
      }),
    setIsDeviceSettingsOpen: (val) =>
      set((state) => {
        state.isDeviceSettingsOpen = val;
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
