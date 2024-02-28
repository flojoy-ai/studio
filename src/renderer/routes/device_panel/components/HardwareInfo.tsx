import {
  useHardwareRefetch,
  useHardwareDevices,
} from "@/renderer/hooks/useHardwareDevices";
import { DeviceCardProps } from "./DeviceCard";
import { DeviceSection } from "./DeviceSection";
import { Button } from "@/renderer/components/ui/button";
import { DebugMenu } from "./DebugMenu";
import { ConnectionHelp } from "./ConnectionHelp";
import { useSettingsStore } from "@/renderer/stores/settings";

export const HardwareInfo = () => {
  const devices = useHardwareDevices();
  const refetch = useHardwareRefetch();
  const deviceSettings = useSettingsStore((state) => state.device);
  const { nidmmDeviceDiscovery, niDAQmxDeviceDiscovery } = deviceSettings;

  if (!devices) {
    return (
      <>
        <Button
          onClick={() => {
            refetch(niDAQmxDeviceDiscovery.value, nidmmDeviceDiscovery.value);
          }}
        >
          Refresh
        </Button>
        <div className="py-3" />
        <div>loading...</div>
      </>
    );
  }

  // Base Devices

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

  // Driver Dependent Devices
  const niDevices = devices.nidaqmxDevices.concat(devices.nidmmDevices);

  const driverDependentDevices: DeviceCardProps[] | undefined =
    niDevices.length > 0
      ? niDevices.reduce((uniqueDevices, d) => {
          const existingDevice = uniqueDevices.find(
            (ud) => ud.description === d.description,
          );
          if (!existingDevice) {
            uniqueDevices.push({
              name: d.name.replace(/ -.*/, ""),
              port: d.address.replace(/\/.*/, "/channel"),
              description: d.description,
            });
          }
          return uniqueDevices;
        }, [] as DeviceCardProps[])
      : undefined;

  return (
    <div className="max-h-screen overflow-y-auto">
      <div className="flex gap-2">
        <Button
          onClick={() => {
            refetch(niDAQmxDeviceDiscovery.value, nidmmDeviceDiscovery.value);
          }}
        >
          Refresh
        </Button>
        <DebugMenu />
        <ConnectionHelp />
      </div>
      <div className="py-3" />
      <DeviceSection title="Cameras" devices={cameras} />
      <div className="py-6" />
      <DeviceSection title="Serial" devices={serialDevices} />
      <div className="py-6" />
      <DeviceSection title="VISA" devices={visaDevices} />
      <div className="py-6" />
      <DeviceSection
        title="Driver-Dependent Devices"
        devices={driverDependentDevices}
      />
      {driverDependentDevices === undefined && (
        <h5 className="text-accent5 mb-2 pt-2 text-xs">
          To enable driver-dependent discovery, see: Settings → Device Settings
        </h5>
      )}
    </div>
  );
};
