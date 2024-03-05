import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { DeviceInfo } from "@/renderer/types/hardware";
import { getDeviceInfo } from "@/renderer/lib/api";
import { ZodError } from "zod";
import { Result } from "neverthrow";
import { HTTPError } from "ky";

type State = {
  devices: DeviceInfo | undefined;
};

type Actions = {
  refresh: (
    discoverNIDAQmxDevices?: boolean,
    discoverNIDMMDevices?: boolean,
  ) => Promise<Result<void, HTTPError | ZodError>>;
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
      return res.map((info) => set({ devices: info }));
    },
  })),
);
