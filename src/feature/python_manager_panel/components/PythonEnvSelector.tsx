import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@src/components/ui/button";
import { Label } from "@src/components/ui/label";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Environments } from "../types/environment";

const PythonEnvSelector = () => {
  const [environments, setEnvironments] = useState<Environments>([]);
  // TODO: Need to store the selected env in the store
  const [selectedEnvironment, setSelectedEnvironment] = useState<
    string | undefined
  >(undefined);

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

  useEffect(() => {
    getEnvironments();
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Label className="whitespace-nowrap">Flojoy Python Environment: </Label>
      <Select
        value={selectedEnvironment || undefined}
        onValueChange={setSelectedEnvironment}
      >
        <SelectTrigger className="grow">
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
      <Button onClick={getEnvironments}>Refresh</Button>
    </div>
  );
};

export default PythonEnvSelector;

