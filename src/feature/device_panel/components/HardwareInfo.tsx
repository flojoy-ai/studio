import {
  useHardwareRefetch,
  useHardwareDevices,
} from "@src/hooks/useHardwareDevices";
import { DeviceCardProps } from "./DeviceCard";
import { DeviceSection } from "./DeviceSection";
import { Button } from "@src/components/ui/button";

export const HardwareInfo = () => {
  const devices = useHardwareDevices();
  const refetch = useHardwareRefetch();

  if (!devices) {
    return (
      <>
        <Button onClick={refetch}>Refresh</Button>
        <div className="py-3" />
        <div>loading...</div>
      </>
    );
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
            port: typeof c.id === "number" ? undefined : `Port: ${c.id}`,
          };
        })
      : undefined;

  const serialDevices: DeviceCardProps[] | undefined =
    devices.serialDevices.length > 0
      ? devices.serialDevices.map((d) => ({
          name: d.description,
          port: `Port: ${d.port}`,
          description: d.hwid,
          manufacturer: d.manufacturer,
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

  const mecademicDevices: DeviceCardProps[] | undefined =
    devices.mecademicDevices.length > 0
      ? devices.mecademicDevices.map((d) => ({
          name: d.name,
          port: d.ip,
        }))
      : undefined;

  return (
    <div>
      <Button onClick={refetch}>Refresh</Button>
      <div className="py-3" />
      <DeviceSection title="Cameras" devices={cameras} />
      <div className="py-6" />
      <DeviceSection title="Serial" devices={serialDevices} />
      <div className="py-6" />
      <DeviceSection title="VISA" devices={visaDevices} />
      <div className="py-6" />
      <DeviceSection title="Mecademic" devices={mecademicDevices} />
    </div>
  );
};
