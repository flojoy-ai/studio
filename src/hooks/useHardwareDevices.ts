import { getDeviceInfo } from "@src/services/FlowChartServices";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { z } from "zod";

const CameraDevice = z.object({
  name: z.string(),
  id: z.union([z.string(), z.number()]),
});

type CameraDevice = z.infer<typeof CameraDevice>;

const SerialDevice = z.object({
  description: z.string(),
  hwid: z.string(),
  port: z.string(),
});

type SerialDevice = z.infer<typeof SerialDevice>;

const VISADevice = z.object({
  name: z.string(),
  address: z.string(),
  description: z.string(),
});

type VISADevice = z.infer<typeof VISADevice>;

const DeviceInfo = z.object({
  cameras: z.array(CameraDevice),
  serialDevices: z.array(SerialDevice),
  visaDevices: z.array(VISADevice),
});

type DeviceInfo = z.infer<typeof DeviceInfo>;

const deviceAtom = atom<DeviceInfo | undefined>(undefined);

const refetchDeviceInfo = async () => {
  const data = await getDeviceInfo();
  return DeviceInfo.parse(data);
};

export const useHardwareRefetch = () => {
  const setDevices = useSetAtom(deviceAtom);

  return useCallback(async () => {
    setDevices(undefined);
    const data = await refetchDeviceInfo();
    setDevices(data);
  }, [setDevices]);
};

export const useHardwareDevices = () => useAtomValue(deviceAtom);
