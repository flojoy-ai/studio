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
  manufacturer: z.nullable(z.string()),
});

type SerialDevice = z.infer<typeof SerialDevice>;

const VISADevice = z.object({
  name: z.string(),
  address: z.string(),
  description: z.string(),
});

type VISADevice = z.infer<typeof VISADevice>;

const NIDAQmxDevice = z.object({
  name: z.string(),
  address: z.string(),
  description: z.string(),
});

type NIDAQmxDevice = z.infer<typeof NIDAQmxDevice>;

const DeviceInfo = z.object({
  cameras: z.array(CameraDevice),
  serialDevices: z.array(SerialDevice),
  visaDevices: z.array(VISADevice),
  nidaqmxDevices: z.array(NIDAQmxDevice),
});

export type DeviceInfo = z.infer<typeof DeviceInfo>;

const deviceAtom = atom<DeviceInfo | undefined>(undefined);

const refetchDeviceInfo = async (includeDrivers = false) => {
  console.log("include", includeDrivers);
  const data = await getDeviceInfo(includeDrivers);
  return DeviceInfo.parse(data);
};

export const useHardwareRefetch = (includeDrivers) => {
  const setDevices = useSetAtom(deviceAtom);

  return useCallback(async () => {
    setDevices(undefined);
    console.log("refetching devices", includeDrivers)
    const data = await refetchDeviceInfo(includeDrivers);
    setDevices(data);
  }, [setDevices]);
};

export const useHardwareDevices = () => useAtomValue(deviceAtom);
