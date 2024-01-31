import { useHardwareDevices } from "@src/hooks/useHardwareDevices";
import { DeviceSelect, SelectProps } from "./DeviceSelect";

export const NIDAQmxDeviceSelect = (props: SelectProps) => {
  const hardware = useHardwareDevices();
  const daq = hardware?.nidaqmxDevices.filter((d) => d.address !== "");

  return (
    <DeviceSelect
      {...props}
      devices={daq}
      placeholder="No NI-DAQmx devices found"
      keySelector={(d) => d.name}
      valueSelector={(d) => d.address}
      nameSelector={(d) => d.description}
    />
  );
};
