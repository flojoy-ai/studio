import { useHardwareDevices } from "@src/hooks/useHardwareDevices";
import { DeviceSelect, SelectProps } from "./DeviceSelect";

export const VisaDeviceSelect = (props: SelectProps) => {
  const hardware = useHardwareDevices();
  const cameras = hardware?.visaDevices;

  return (
    <DeviceSelect
      {...props}
      devices={cameras}
      placeholder="No serial devices found"
      keySelector={(d) => d.address}
      valueSelector={(d) => d.address}
      nameSelector={(d) => d.description}
    />
  );
};
