import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

type SettingBase = {
  title: string;
  desc: string;
};

type BooleanSetting = SettingBase & {
  type: "boolean";
  value: boolean;
};

type NumberSetting = SettingBase & {
  type: "number";
  value: number;
};

export type Setting = BooleanSetting | NumberSetting;

const initialBackendSettings = {
  nodeDelay: {
    type: "number",
    title: "Node Delay",
    desc: "Delay before running the next node in milliseconds",
    value: 0,
  },
  maximumRuntime: {
    type: "number",
    title: "Maximum Runtime",
    desc: "Time before the program cancels automatically in seconds",
    value: 3000,
  },
  maximumConcurrentWorkers: {
    type: "number",
    title: "Maximum Concurrent Workers",
    desc: "Maximum number of nodes that can be executed at the same time",
    value: 1,
  },
} satisfies Record<string, Setting>;

const initialFrontendSettings = {
  fitViewOnResize: {
    type: "boolean",
    title: "Fit view on resize",
    desc: "Center the view of the flow chart automatically when the window is resized",
    value: true,
  },
} satisfies Record<string, Setting>;

const initialDeviceSettings = {
  niDAQmxDeviceDiscovery: {
    type: "boolean",
    title: "Discover NI-DAQmx devices",
    desc: "Enable the discovery of NI compactDAQ devices and other devices relying on NI-DAQmx. Note that activating this option may lead to a longer loading time.",
    value: false,
  },
  nidmmDeviceDiscovery: {
    type: "boolean",
    title: "Discover NI-DMM devices",
    desc: "Enable the discovery of NI DMM devices and other devices relying on NI-DMM. Note that activating this option may lead to a longer loading time.",
    value: false,
  },
} satisfies Record<string, Setting>;

type BackendSettings = typeof initialBackendSettings;
type FrontendSettings = typeof initialFrontendSettings;
type DeviceSettings = typeof initialDeviceSettings;

export type SettingsState = {
  frontend: FrontendSettings;
  backend: BackendSettings;
  device: DeviceSettings;
};

export type SettingsActions = {
  updateFrontendSettings: <K extends keyof FrontendSettings>(
    key: K,
    value: FrontendSettings[K]["value"],
  ) => void;
  updateBackendSettings: <K extends keyof BackendSettings>(
    key: K,
    value: BackendSettings[K]["value"],
  ) => void;
  updateDeviceSettings: <K extends keyof DeviceSettings>(
    key: K,
    value: DeviceSettings[K]["value"],
  ) => void;
};

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  immer(
    persist(
      (set) => ({
        frontend: initialFrontendSettings,
        backend: initialBackendSettings,
        device: initialDeviceSettings,

        updateFrontendSettings: <K extends keyof FrontendSettings>(
          key: K,
          value: FrontendSettings[K]["value"],
        ) => {
          set((state) => {
            state.frontend[key].value = value;
          });
        },
        updateBackendSettings: <K extends keyof BackendSettings>(
          key: K,
          value: BackendSettings[K]["value"],
        ) => {
          set((state) => {
            state.backend[key].value = value;
          });
        },
        updateDeviceSettings: <K extends keyof DeviceSettings>(
          key: K,
          value: DeviceSettings[K]["value"],
        ) => {
          set((state) => {
            state.device[key].value = value;
          });
        },
      }),
      { name: "flojoy-settings" },
    ),
  ),
);
