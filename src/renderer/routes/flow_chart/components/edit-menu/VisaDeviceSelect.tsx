import { useHardwareStore } from "@/renderer/stores/hardware";
import { DeviceSelect, SelectProps } from "./DeviceSelect";

export const VisaDeviceSelect = (props: SelectProps) => {
  const hardware = useHardwareStore((state) => state.devices);
  const cameras = hardware?.visaDevices;

  return (
    <DeviceSelect
      {...props}
      devices={cameras}
      placeholder="No VISA devices found"
      keySelector={(d) => d.address}
      valueSelector={(d) => d.address}
      nameSelector={(d) => d.description}
    />
  );
};
