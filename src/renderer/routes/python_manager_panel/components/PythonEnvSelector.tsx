import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/renderer/components/ui/select";
import { Button } from "@/renderer/components/ui/button";
import { useEffect, useState } from "react";
import { z } from "zod";
import { EnvironmentList } from "../types/environment";
import { toast } from "sonner";
import { useFlowChartState } from "@src/hooks/useFlowChartState";

const PythonEnvSelector = () => {
  const [environments, setEnvironments] = useState<EnvironmentList>([]);
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
        envs: EnvironmentList,
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
    <div className="flex flex-col gap-2">
      <div className="whitespace-nowrap text-lg font-semibold">
        Flojoy Python Environment
      </div>
      <div className="text-sm">
        This is the Python environment that Flojoy will use to run your
        flowchart.
      </div>
      <div className="flex gap-2">
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
                  <span className="font-semibold">{getEnvName(env)}</span>:{" "}
                  {env}
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

        <Button
          className="whitespace-nowrap"
          onClick={() => {
            window.navigator.clipboard.writeText(currentPythonEnv || "");
            toast.message("Copied to clipboard");
          }}
        >
          Copy Path
        </Button>
      </div>
    </div>
  );
};

export default PythonEnvSelector;
