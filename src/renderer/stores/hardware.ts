import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { DeviceInfo } from "@/renderer/types/hardware";
import { getDeviceInfo } from "@/renderer/lib/api";
import { tryParse } from "@/types/result";
import { ZodError } from "zod";
import { Result } from "neverthrow";

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
      set({ devices: undefined });
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
