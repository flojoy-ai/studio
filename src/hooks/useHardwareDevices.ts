import { getDeviceInfo } from "@src/services/FlowChartServices";
import { atom, useAtomValue } from "jotai";
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

export const refetchDeviceInfo = async () => {
  const data = await getDeviceInfo();
  return DeviceInfo.parse(data);
};

// export const useHardwareRefetch = () => {
//   const setDevices = useSetAtom(deviceAtom);
//
//   useEffect(() => {
//     refetchDeviceInfo().then((data) => setDevices(data));
//   });
//
//   useEffect(() => {
//     const interval = setInterval(async () => {
//       setDevices(await refetchDeviceInfo());
//     }, 2000);
//
//     return () => {
//       clearInterval(interval);
//     };
//   });
// };

export const useHardwareDevices = () => useAtomValue(deviceAtom);
