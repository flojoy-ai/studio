import { getDeviceInfo } from "@src/services/FlowChartServices";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { z } from "zod";

const CameraDevice = z.object({
  name: z.string(),
  id: z.union([z.string(), z.number()]),
});

type CameraDevice = z.infer<typeof CameraDevice>;

const DeviceInfo = z.object({
  cameras: z.array(CameraDevice),
  serialDevices: z.array(z.any()),
});

type DeviceInfo = z.infer<typeof DeviceInfo>;

const deviceAtom = atom<DeviceInfo | undefined>(undefined);

const refetchDeviceInfo = async () => {
  const data = await getDeviceInfo();
  return DeviceInfo.parse(data);
};

export const useHardwareRefetch = () => {
  const setDevices = useSetAtom(deviceAtom);

  useEffect(() => {
    refetchDeviceInfo().then((data) => setDevices(data));
  });

  useEffect(() => {
    const interval = setInterval(async () => {
      setDevices(await refetchDeviceInfo());
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  });
};

export const useHardwareDevices = () => useAtomValue(deviceAtom);
