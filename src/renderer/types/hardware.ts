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

const NIDMMDevice = z.object({
  name: z.string(),
  address: z.string(),
  description: z.string(),
});

type NIDMMDevice = z.infer<typeof NIDMMDevice>;

export const DeviceInfo = z.object({
  cameras: z.array(CameraDevice),
  serialDevices: z.array(SerialDevice),
  visaDevices: z.array(VISADevice),
  nidaqmxDevices: z.array(NIDAQmxDevice),
  nidmmDevices: z.array(NIDMMDevice),
});

export type DeviceInfo = z.infer<typeof DeviceInfo>;
