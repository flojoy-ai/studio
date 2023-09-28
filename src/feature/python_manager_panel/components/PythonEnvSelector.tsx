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
import { toast } from "sonner";
import { useFlowChartState } from "@src/hooks/useFlowChartState";

const PythonEnvSelector = () => {
  const [environments, setEnvironments] = useState<Environments>([]);
  const { currentPythonEnv, setCurrentPythonEnv } = useFlowChartState();

  const getEnvName = (path: string) => {
    // Here is to identify whether the path separator is windows or not
    const separator = path.includes("/") ? "/" : "\\";

    const components = path.split(separator); // Split the path into components

    const lastFolderName = components[components.length - 1]; // Get the last component

    return lastFolderName;
  };

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
        value={currentPythonEnv || undefined}
        onValueChange={setCurrentPythonEnv}
      >
        <SelectTrigger className="grow">
          <SelectValue placeholder="Please select an environment" />
        </SelectTrigger>
        <SelectContent>
          {environments.map((env) => {
            return (
              <SelectItem key={env} value={env}>
                <span className="font-semibold">{getEnvName(env)}</span>: {env}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <Button
        onClick={() => {
          toast.promise(getEnvironments, {
            loading: "Refreshing environment list...",
            success: () => {
              return "Environment list refreshed";
            },
            error: "Something went wrong with refreshing!",
          });
        }}
      >
        Refresh
      </Button>
    </div>
  );
};

export default PythonEnvSelector;
