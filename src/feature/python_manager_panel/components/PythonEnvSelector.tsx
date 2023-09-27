import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@src/components/ui/label";
import { useEffect, useState } from "react";
import { z } from "zod";

const Environments = z.array(z.string());

type Environments = z.infer<typeof Environments>;

const PythonEnvSelector = () => {
  const [environments, setEnvironments] = useState<Environments>([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState("");

  useEffect(() => {
    // send a get request to http://127.0.0.1:5392/devices
    const getEnvironments = async () => {
      const response = await fetch("http://localhost:5392/pymgr/envs");

      const data = await response.json();

      const parsedData = await z
        .object({
          envs: Environments,
        })
        .safeParseAsync(data);

      if (parsedData.success) {
        setEnvironments(parsedData.data.envs);
      }
    };

    getEnvironments();
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Label>Flojoy Python Environment: </Label>
      <Select
        value={selectedEnvironment}
        onValueChange={setSelectedEnvironment}
      >
        <SelectTrigger className="w-[560px]">
          <SelectValue placeholder="Please select an environment" />
        </SelectTrigger>
        <SelectContent>
          {environments.map((env) => {
            return (
              <SelectItem key={env} value={env}>
                {env}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PythonEnvSelector;
