import { useHardwareDevices } from "@src/hooks/useHardwareDevices";
import { DeviceCardProps } from "./DeviceCard";
import { DeviceSection } from "./DeviceSection";

export const HardwareInfo = () => {
  const devices = useHardwareDevices();

  if (!devices) {
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

  return (
    <div>
      <DeviceSection title="Cameras" devices={cameras} />
      <div className="py-6" />
      <DeviceSection title="Serial" devices={serialDevices} />
    </div>
  );
};
