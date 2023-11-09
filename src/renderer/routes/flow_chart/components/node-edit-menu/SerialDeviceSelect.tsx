import { useHardwareDevices } from "@src/hooks/useHardwareDevices";
import { DeviceSelect, SelectProps } from "./DeviceSelect";

export const SerialDeviceSelect = (props: SelectProps) => {
  const hardware = useHardwareDevices();
  const cameras = hardware?.serialDevices;

  return (
    <DeviceSelect
      {...props}
      devices={cameras}
      placeholder="No serial devices found"
      keySelector={(d) => d.port}
      valueSelector={(d) => d.port}
      nameSelector={(d) => d.description}
    />
  );
};
