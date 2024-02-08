import { useHardwareDevices } from "@/renderer/hooks/useHardwareDevices";
import { DeviceSelect, SelectProps } from "./DeviceSelect";
import { useSettings } from "@/renderer/hooks/useSettings";

export const NIDAQmxDeviceSelect = (props: SelectProps) => {
  const hardware = useHardwareDevices();
  const daq = hardware?.nidaqmxDevices.filter((d) => d.address !== "");

  const { settings } = useSettings("device");
  const setting = settings.find(
    (setting) => setting.key === "niDAQmxDeviceDiscovery",
  );
  const discoveryOn = setting ? setting.value : false;

  return (
    <DeviceSelect
      {...props}
      devices={daq}
      placeholder={
        discoveryOn
          ? "No NI-DAQmx devices found | Open NI Max and refresh"
          : "Discovery is off | See settings to enable it"
      }
      keySelector={(d) => d.name}
      valueSelector={(d) => d.address}
      nameSelector={(d) => d.name}
    />
  );
};
