import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/renderer/components/ui/select";
import { captain } from "@/renderer/lib/ky";
import { EnvVar } from "@/renderer/types/envVar";
import { useState, useEffect } from "react";

export type SelectProps = {
  onValueChange: (value: string) => void;
  value: string | number | boolean | null | undefined;
};

export const SecretSelect = ({ onValueChange, value }: SelectProps) => {
  const [secrets, setSecrets] = useState<string[]>([]);

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const res = (await captain.get("env").json()) as EnvVar[];
        const keys = res.map((d) => d.key);
        setSecrets(keys);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCredentials();
  }, []);

  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger
        className="border-none bg-background focus:ring-accent1 focus:ring-offset-1 focus-visible:ring-accent1 focus-visible:ring-offset-1 "
        disabled={!secrets.length}
      >
        <SelectValue
          placeholder={secrets.length ? value : "No environment variable found"}
        />
      </SelectTrigger>
      <SelectContent className="max-h-72">
        <SelectGroup>
          {!!secrets.length &&
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
