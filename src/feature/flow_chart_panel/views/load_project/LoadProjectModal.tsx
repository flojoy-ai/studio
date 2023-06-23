import { createStyles, Modal, Table, Title } from "@mantine/core";
import {
  handleProjectLoadAtom,
  useFlowChartState,
} from "@src/hooks/useFlowChartState";
import {
  getProjectFromCloudById,
  getProjectsFromCloud,
} from "@src/services/FlowChartServices";
import { useEffect, useState } from "react";
import { ProjectComponent } from "./ProjectComponent";
import {
  handleEdgesLoadAtom,
  handleNodesLoadAtom,
} from "@src/hooks/useFlowChartGraph";
import { useAtom } from "jotai";
import { notifications } from "@mantine/notifications";
import { ProjectWithoutData } from "../../types/Project";

const useStyles = createStyles(() => ({
  tableRow: {
    padding: "8px 4px",
    color: "white",
    cursor: "pointer",
  },
}));

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
  const [, setProject] = useAtom(handleProjectLoadAtom);
  const { classes } = useStyles();

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
      setProject(res);
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
    content = <div>No projects found.</div>;
  } else {
    const rows = projects.map((p, i) => (
      <tr
        key={`${p}-${i}`}
        className={classes.tableRow}
        onClick={() => loadProject(p)}
      >
        <td>{p.name}</td>
        <td>{new Date().toLocaleString()}</td>
      </tr>
    ));
    content = (
      <Table horizontalSpacing="md" verticalSpacing="md" highlightOnHover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date Last Opened</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    );
  }

  return (
    <Modal opened={open} onClose={onClose} size="lg" radius="md" padding="lg">
      <Title mb={20}>Load Project</Title>
      {content}
    </Modal>
  );
};
