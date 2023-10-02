import { useHardwareDevices } from "@src/hooks/useHardwareDevices";
import { DeviceSelect, SelectProps } from "./DeviceSelect";

export const MecademicDeviceSelect = (props: SelectProps) => {
  const hardware = useHardwareDevices();
  const mecas = hardware?.mecademicDevices;

  return (
    <DeviceSelect
      {...props}
      devices={mecas}
      placeholder="No cameras found"
      keySelector={(meca) => meca.ip.toString()}
      valueSelector={(meca) => meca.ip.toString()}
      nameSelector={(meca) => meca.name}
    />
  );
};
