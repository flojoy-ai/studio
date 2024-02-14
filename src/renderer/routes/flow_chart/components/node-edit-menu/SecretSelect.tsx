import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/renderer/components/ui/select";
import { baseClient } from "@/renderer/lib/base-client";
import { useFlowChartState } from "@/renderer/hooks/useFlowChartState";
import { useState, useEffect } from "react";

export type SelectProps = {
  onValueChange: (value: string) => void;
  value: string | number | boolean | null | undefined;
};

export const SecretSelect = ({ onValueChange, value }: SelectProps) => {
  // TODO: use default value
  // TODO: Do I need all those useState ?
  const [secrets, setSecrets] = useState<string[]>([]);
  const [found, setFound] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const res = await baseClient.get("env");
        const keys = res.data.map((d) => d.key);
        setSecrets(keys);
        setFound(keys.length > 0);
        setSelected(keys[0] ?? "No Environment Variables found");
      } catch (error) {
        console.log(error);
      }
    };

    fetchCredentials();
  }, []);

  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger
        className="border-none bg-background focus:ring-accent1 focus:ring-offset-1 focus-visible:ring-accent1 focus-visible:ring-offset-1 "
        disabled={!found}
      >
        <SelectValue placeholder={selected} />
      </SelectTrigger>
      <SelectContent className="max-h-72">
        <SelectGroup>
          {found &&
            secrets.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
