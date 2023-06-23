import { Box, Modal, Title } from "@mantine/core";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import {
  getProjectFromCloudById,
  getProjectsFromCloud,
} from "@src/services/FlowChartServices";
import { useEffect, useState } from "react";
import { ReactFlowJsonObject } from "reactflow";
import { ProjectComponent } from "./ProjectComponent";
import {
  handleEdgesLoadAtom,
  handleNodesLoadAtom,
} from "@src/hooks/useFlowChartGraph";
import { useAtom } from "jotai";
import { notifications } from "@mantine/notifications";
import { ElementsData } from "../../types/CustomNodeProps";

export type Project = {
  ref: string;
  userId: string;
  name: string;
  rfInstance: ReactFlowJsonObject<ElementsData, any>;
};

export type ProjectWithoutData = Omit<Project, "rfInstance">;

type Props = {
  open: boolean;
  onClose: () => void;
};

export const LoadProjectModal = ({ open, onClose }: Props) => {
  const [projects, setProjects] = useState<
    ProjectWithoutData[] | undefined | null
  >(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [, setNodes] = useAtom(handleNodesLoadAtom);
  const [, setEdges] = useAtom(handleEdgesLoadAtom);
  const { setRfInstance } = useFlowChartState();

  useEffect(() => {
    if (!open) {
      return;
    }
    getProjectsFromCloud()
      .then((data) => {
        setProjects(data);
      })
      .catch((e) => {
        setProjects(null);
        setError(e.message);
      });
  }, [open]);

  const loadProject = async (project: ProjectWithoutData) => {
    try {
      const res = await getProjectFromCloudById(project.ref);
      setNodes(res.rfInstance.nodes);
      setEdges(res.rfInstance.edges);
      setRfInstance(res.rfInstance);
      notifications.show({
        title: "Success",
        message: "Project loaded successfully",
        color: "cyan",
      });
    } catch {
      notifications.show({
        title: "Error",
        message: "Could not load project",
        color: "red",
      });
    }
    onClose();
  };

  let content: React.ReactNode;
  if (projects === undefined) {
    content = <div>Loading...</div>;
  } else if (projects === null) {
    content = <div>Failed to get projects from cloud, reason: {error}</div>;
  } else if (projects.length === 0) {
    content = <div>No projects found</div>;
  } else {
    content = projects.map((p) => (
      <ProjectComponent key={p.name} project={p} loadProject={loadProject} />
    ));
  }

  return (
    <Modal opened={open} onClose={onClose}>
      <Title mb={20}>Load Project</Title>
      {content}
    </Modal>
  );
};
