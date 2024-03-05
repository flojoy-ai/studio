import { useHardwareStore } from "@/renderer/stores/hardware";
import { DeviceSelect, SelectProps } from "./DeviceSelect";

export const CameraSelect = (props: SelectProps) => {
  const hardware = useHardwareStore((state) => state.devices);
  const cameras = hardware?.cameras;

  return (
    <DeviceSelect
      {...props}
      devices={cameras}
      placeholder="No cameras found"
      keySelector={(cam) => cam.id.toString()}
      valueSelector={(cam) => cam.id.toString()}
      nameSelector={(cam) => cam.name}
    />
  );
};
