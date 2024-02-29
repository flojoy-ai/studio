import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { DeviceInfo } from "@/renderer/hooks/useHardwareDevices";

type State = {
  deviceInfo: DeviceInfo;
};

type Actions = {
  setDeviceInfo: (deviceInfo: DeviceInfo) => void;
};

export const useHardwareStore = create<State & Actions>()(
  immer((set) => ({
    deviceInfo: {
      cameras: [],
      serialDevices: [],
      visaDevices: [],
      nidaqmxDevices: [],
      nidmmDevices: [],
    },
    setDeviceInfo: (deviceInfo) => {
      set((state) => {
        state.deviceInfo = deviceInfo;
      });
    },
  })),
);
