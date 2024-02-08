import { useHardwareDevices } from "@/renderer/hooks/useHardwareDevices";
import { DeviceSelect, SelectProps } from "./DeviceSelect";
import { useSettings } from "@/renderer/hooks/useSettings";

export const NIDMMDeviceSelect = (props: SelectProps) => {
  const hardware = useHardwareDevices();
  const dmm = hardware?.nidmmDevices.filter((d) => d.address !== "");

  const { settings } = useSettings("device");
  const setting = settings.find(
    (setting) => setting.key === "nidmmDeviceDiscovery",
  );
  const discoveryOn = setting ? setting.value : false;

  return (
    <DeviceSelect
      {...props}
      devices={dmm}
      placeholder={
        discoveryOn
          ? "No NI-DMM devices found | Open NI Max and refresh"
          : "Discovery is off | See settings to enable it"
      }
      keySelector={(d) => d.name}
      valueSelector={(d) => d.address}
      nameSelector={(d) => d.name}
    />
  );
};
