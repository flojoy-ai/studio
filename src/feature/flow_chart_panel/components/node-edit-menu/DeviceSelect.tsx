import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@src/components/ui/select";

export type SelectProps = {
  onValueChange: (value: string) => void;
  value: string | number | boolean | null | undefined;
};

type DeviceSelectProps<T> = {
  onValueChange: (value: string) => void;
  value: string | number | boolean | null | undefined;
  placeholder?: string;
  devices: T[] | undefined;
  keySelector: (device: T) => string;
  valueSelector: (device: T) => string;
  nameSelector: (device: T) => string;
};

export const DeviceSelect = <T,>({
  onValueChange,
  value,
  placeholder,
  devices,
  keySelector,
  valueSelector,
  nameSelector,
}: DeviceSelectProps<T>) => {
  const found = devices && devices.length > 0;

  const selectedDevice = devices?.find((d) => valueSelector(d) === value);
  const selectedDeviceName = selectedDevice
    ? nameSelector(selectedDevice)
    : undefined;

  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger
        className="border-none bg-background focus:ring-accent1 focus:ring-offset-1 focus-visible:ring-accent1 focus-visible:ring-offset-1 "
        disabled={!found}
      >
        <SelectValue placeholder={selectedDeviceName ?? placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-72">
        <SelectGroup>
          {found &&
            devices.map((d) => (
              <SelectItem key={keySelector(d)} value={valueSelector(d)}>
                {nameSelector(d)}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
