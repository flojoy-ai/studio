import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@src/components/ui/select";
import { useHardwareDevices } from "@src/hooks/useHardwareDevices";

type CameraSelectProps = {
  onValueChange: (value: string) => void;
  value: string | number | boolean | null | undefined;
};

export const CameraSelect = ({ onValueChange, value }: CameraSelectProps) => {
  const hardware = useHardwareDevices();
  const cameras = hardware?.cameras;

  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger className="border-none bg-background focus:ring-accent1 focus:ring-offset-1 focus-visible:ring-accent1 focus-visible:ring-offset-1 ">
        <SelectValue placeholder={value} />
      </SelectTrigger>
      <SelectContent className="max-h-72">
        <SelectGroup>
          {cameras &&
            cameras.length > 0 &&
            cameras.map((cam) => (
              <SelectItem key={cam.name} value={cam.id.toString()}>
                {cam.name}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
