import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/renderer/components/ui/select";
import { baseClient } from "@/renderer/lib/base-client";
import {
  EnvVarCredentialType,
  useFlowChartState,
} from "@/renderer/hooks/useFlowChartState";
import {
  memo,
  ChangeEvent,
  ClipboardEvent,
  useState,
  useEffect,
  useCallback,
} from "react";


export type SelectProps = {
  onValueChange: (value: string) => void;
  value: string | number | boolean | null | undefined;
};

type DeviceSelectProps = {
  onValueChange: (value: string) => void;
  value: string | null | undefined;
};

export const SecretSelect = ({
  onValueChange,
  value,
}: SelectProps) => {

  const { credentials, setCredentials } = useFlowChartState();
  const [secrets, setSecrets] = useState<string[]>([]);
  const [found, setFound] = useState<boolean>(false);
  const [selected, setSelected] = useState<string | undefined>(undefined);
  setSelected(value?.toString());

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const res = await baseClient.get("env");
        setCredentials(res.data);
        console.log("fetchCredentials");
        console.log(credentials);
        const keys = res.data.map((d) => d.key);
        setSecrets(keys);
        setFound(keys.length > 0);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCredentials();
  }, [setCredentials]);


  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger
        className="border-none bg-background focus:ring-accent1 focus:ring-offset-1 focus-visible:ring-accent1 focus-visible:ring-offset-1 "
        disabled={
            value  && !found ? "No Environment Variable Set" : value
          }
}
      >
        <SelectValue
          placeholder={"No Environment Variables found"}
        />
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
