import { useEffect, useState } from "react";
import { Input } from "@/renderer/components/ui/input";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import LockableButton from "./lockable/LockedButtons";
import { useTestSequencerWS } from "@/renderer/context/testSequencerWS.context";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/renderer/components/ui/select";
import { Button } from "@/renderer/components/ui/button";
import { useAppStore } from "@/renderer/stores/app";
import { useShallow } from "zustand/react/shallow";
import { testSequenceExportCloud } from "@/renderer/routes/test_sequencer_panel/models/models";
import { getCloudProjects, getEnvironmentVariables } from "@/renderer/lib/api";
import { toastQueryError } from "@/renderer/utils/report-error";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@/renderer/components/ui/spinner";

export function CloudPanel() {
  const queryClient = useQueryClient();
  const [hardwareId, setHardwareId] = useState("");
  const [projectId, setProjectId] = useState("");
  const { tree, setIsLocked } = useTestSequencerState();
  const { tSSendJsonMessage } = useTestSequencerWS();

  const envsQuery = useQuery({
    queryKey: ["envs"],
    queryFn: async () => {
      const res = await getEnvironmentVariables();
      return res.match(
        (vars) => vars,
        (e) => {
          toastQueryError(e, "Failed to fetch environment variables");
          return [];
        },
      );
    },
  });

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      if (envsQuery.isSuccess) {
        if (
          envsQuery.data.some((c) => c.key === "FLOJOY_CLOUD_WORKSPACE_SECRET")
        ) {
          const res = await getCloudProjects();
          return res.match(
            (vars) => vars,
            (e) => {
              toastQueryError(e, "Failed to fetch cloud projects");
              return [];
            },
          );
        }
      }
      return [];
    },
    enabled: envsQuery.isSuccess,
  });

  const { isEnvVarModalOpen, setIsEnvVarModalOpen } = useAppStore(
    useShallow((state) => ({
      isEnvVarModalOpen: state.isEnvVarModalOpen,
      setIsEnvVarModalOpen: state.setIsEnvVarModalOpen,
    })),
  );

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["envs"] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnvVarModalOpen]);

  const handleExport = () => {
    tSSendJsonMessage(testSequenceExportCloud(tree, hardwareId, projectId));
    setIsLocked(true);
  };

  if (!envsQuery.isSuccess || !projectsQuery.isSuccess) {
    return <Spinner />;
  }

  const isCloudKeySet = envsQuery.data.some(
    (c) => c.key === "FLOJOY_CLOUD_WORKSPACE_SECRET",
  );

  if (!isCloudKeySet) {
    return (
      <Button onClick={() => setIsEnvVarModalOpen(true)} className="w-full">
        Connect to Flojoy Cloud
      </Button>
    );
  }

  return (
    <div className="min-w-[240px] rounded-xl border border-gray-300 p-4 py-4 dark:border-gray-800">
      <div className="flex flex-col">
        <h2 className="mb-2 pt-3 text-center text-lg font-bold text-accent1 ">
          Cloud Panel
        </h2>

        <div className="pb-1 text-muted-foreground">
          <h2>Serial Number</h2>
        </div>
        <Input
          className="focus:ring-accent1 focus:ring-offset-1 focus-visible:ring-accent1 focus-visible:ring-offset-1"
          type="text"
          value={hardwareId}
          onChange={(e) => setHardwareId(e.target.value)}
          placeholder="Scan or enter hardware id"
          autoFocus
        />

        <div className="pb-1 pt-2 text-muted-foreground">
          <h2>Project</h2>
        </div>

        <Select onValueChange={setProjectId}>
          <SelectTrigger>
            <SelectValue placeholder={"Select a project..."} />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {projectsQuery.data.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 p-2 text-sm">
                <strong>No projects found</strong>
                <Button
                  onClick={() => projectsQuery.refetch()}
                  variant={"ghost"}
                >
                  Refresh project list
                </Button>
              </div>
            )}
            {projectsQuery.data.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div>
          <LockableButton
            isLocked={hardwareId === "" || projectId === ""}
            className="mt-4 w-full"
            onClick={handleExport}
          >
            Upload Test Results
          </LockableButton>
        </div>
      </div>
    </div>
  );
}
