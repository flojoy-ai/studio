import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@src/components/ui/select";
import { useHardwareDevices } from "@src/hooks/useHardwareDevices";

type VisaDeviceSelectProps = {
  onValueChange: (value: string) => void;
  value: string | number | boolean | null | undefined;
};

export const VisaDeviceSelect = ({
  onValueChange,
  value,
}: VisaDeviceSelectProps) => {
  const hardware = useHardwareDevices();
  const devices = hardware?.visaDevices;

  const devicesFound = devices && devices.length > 0;

  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger
        className="border-none bg-background focus:ring-accent1 focus:ring-offset-1 focus-visible:ring-accent1 focus-visible:ring-offset-1 "
        disabled={!devicesFound}
      >
        <SelectValue
          placeholder={devicesFound ? value : "No devices detected"}
        />
      </SelectTrigger>
      <SelectContent className="max-h-72">
        <SelectGroup>
          {devices &&
            devices.length > 0 &&
            devices.map((cam) => (
              <SelectItem key={cam.address} value={cam.address}>
                {cam.name}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
