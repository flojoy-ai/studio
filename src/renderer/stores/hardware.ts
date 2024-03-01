import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { DeviceInfo } from "@/renderer/types/hardware";
import { getDeviceInfo } from "@/renderer/lib/api";
import { Result, tryParse } from "@/types/result";
import { ZodError } from "zod";

type State = {
  devices: DeviceInfo | undefined;
};

type Actions = {
  refresh: (
    discoverNIDAQmxDevices?: boolean,
    discoverNIDMMDevices?: boolean,
  ) => Promise<Result<void, Error | ZodError>>;
};

export const useHardwareStore = create<State & Actions>()(
  immer((set) => ({
    devices: undefined,
    refresh: async (
      discoverNIDAQmxDevices = false,
      discoverNIDMMDevices = false,
    ) => {
      const res = await getDeviceInfo(
        discoverNIDAQmxDevices,
        discoverNIDMMDevices,
      );
      return res
        .andThen(tryParse(DeviceInfo))
        .map((info) => set({ devices: info }));
    },
  })),
);
