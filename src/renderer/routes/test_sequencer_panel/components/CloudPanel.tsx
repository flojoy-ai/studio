import { useEffect, useState } from "react";
import { Input } from "@/renderer/components/ui/input";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import LockableButton from "./lockable/LockedButtons";
import { testSequenceExportCloud } from "../models/models";
import { useTestSequencerWS } from "@/renderer/context/testSequencerWS.context";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/renderer/components/ui/select";
import { baseClient } from "@/renderer/lib/base-client";
import { Button } from "@/renderer/components/ui/button";
import EnvVarModal from "../../flow_chart/views/EnvVarModal";

export function CloudPanel() {
  const [isEnvVarModalOpen, setIsEnvVarModalOpen] = useState<boolean>(false);
  const [hardwareId, setHardwareId] = useState("");
  const [projectId, setProjectId] = useState("");
  const { tree, setIsLocked } = useTestSequencerState();
  const { tSSendJsonMessage } = useTestSequencerWS();
  const [projects, setProjects] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);

  const handleExport = () => {
    setIsLocked(true);
    tSSendJsonMessage(testSequenceExportCloud(tree, hardwareId, projectId));
    setIsLocked(true);
  };

  const fetchProjects = async () => {
    const res = await baseClient.get("cloud/projects");
    setProjects(res.data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="min-w-[240px] rounded-xl border border-gray-300 p-4 py-4 dark:border-gray-800">
      <div className="flex flex-col">
        <h2 className="mb-2 pt-3 text-center text-lg font-bold text-accent1 ">
          Cloud Panel
        </h2>

        <div className="pb-1 text-muted-foreground">
          <h2>Hardware id</h2>
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
            {projects.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 p-2 text-sm">
                <strong>No projects found</strong>
                <p>Did you forget to set Flojoy Cloud API key?</p>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    onClick={() => setIsEnvVarModalOpen(true)}
                    variant={"ghost"}
                  >
                    Set API Key
                  </Button>
                  <Button onClick={fetchProjects} variant={"ghost"}>
                    Refresh project list
                  </Button>
                </div>
              </div>
            )}
            {projects.map((option) => (
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
      <EnvVarModal
        handleEnvVarModalOpen={setIsEnvVarModalOpen}
        isEnvVarModalOpen={isEnvVarModalOpen}
      />
    </div>
  );
}
