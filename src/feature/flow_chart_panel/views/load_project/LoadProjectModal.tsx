import { Box, Modal, Title } from "@mantine/core";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import {
  getProjectFromCloudById,
  getProjectsFromCloud,
} from "@src/services/FlowChartServices";
import { useEffect, useState } from "react";
import { ReactFlowJsonObject } from "reactflow";
import { ProjectComponent } from "./ProjectComponent";

export type Project = {
  ref: string;
  userId: string;
  name: string;
  rfInstance: ReactFlowJsonObject;
};

export type ProjectWithoutData = Omit<Project, "rfInstance">;

type Props = {
  open: boolean;
  onClose: () => void;
};

export const LoadProjectModal = ({ open, onClose }: Props) => {
  const [projects, setProjects] = useState<ProjectWithoutData[] | undefined>(
    undefined
  );
  const { setRfInstance } = useFlowChartState();

  useEffect(() => {
    if (!open) {
      return;
    }
    getProjectsFromCloud().then((data) => {
      setProjects(data);
    });
  }, [open]);

  const loadProject = async (project: Project) => {
    const res = await getProjectFromCloudById(project.ref);
  };

  return (
    <Modal opened={open} onClose={onClose}>
      <Title mb={20}>Load Project</Title>
      {projects ? (
        projects.map((p) => (
          <ProjectComponent
            key={p.name}
            project={p}
            onClick={() => undefined}
          />
        ))
      ) : (
        <div>Loading...</div>
      )}
    </Modal>
  );
};
