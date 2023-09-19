import {
  refetchDeviceInfo,
  useHardwareDevices,
} from "@src/hooks/useHardwareDevices";
import { DeviceCardProps } from "./DeviceCard";
import { DeviceSection } from "./DeviceSection";
import { Button } from "@src/components/ui/button";

export const HardwareInfo = () => {
  const devices = useHardwareDevices();

  if (!devices) {
    <Button onClick={refetchDeviceInfo}>Refresh</Button>;
    return <div>loading...</div>;
  }

  const cameras: DeviceCardProps[] | undefined =
    devices.cameras.length > 0
      ? devices.cameras.map((c) => {
          const parts = c.name.split(":");
          const name = parts[0];
          const description = parts.slice(1).join(":").trim();
          return {
            name,
            description,
            port: c.id.toString(),
          };
        })
      : undefined;

  const serialDevices: DeviceCardProps[] | undefined =
    devices.serialDevices.length > 0
      ? devices.serialDevices.map((d) => ({
          name: d.hwid,
          port: d.port,
          description: d.description,
        }))
      : undefined;

  const visaDevices: DeviceCardProps[] | undefined =
    devices.visaDevices.length > 0
      ? devices.visaDevices.map((d) => ({
          name: d.name,
          port: d.address,
          description: d.description,
        }))
      : undefined;

  return (
    <div>
      <Button onClick={refetchDeviceInfo}>Refresh</Button>
      <DeviceSection title="Cameras" devices={cameras} />
      <div className="py-6" />
      <DeviceSection title="Serial" devices={serialDevices} />
      <div className="py-6" />
      <DeviceSection title="VISA" devices={visaDevices} />
    </div>
  );
};
