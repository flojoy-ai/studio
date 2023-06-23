import { Box, createStyles, Text } from "@mantine/core";
import { getProjectFromCloudById } from "@src/services/FlowChartServices";
import { Project, ReactFlowJsonObject } from "reactflow";
import { ProjectWithoutData } from "./LoadProjectModal";

const useStyles = createStyles((theme) => ({
  container: {
    padding: 10,
    width: "100%",
    borderTop: "1px solid gray",
    borderBottom: "1px solid gray",
    cursor: "pointer",
  },
}));

type ProjectComponentProps = {
  project: ProjectWithoutData;
  loadProject: (project: ProjectWithoutData) => void;
};

export const ProjectComponent = ({
  project,
  loadProject,
}: ProjectComponentProps) => {
  const { classes } = useStyles();

  const onClick = () => loadProject(project);

  return (
    <Box className={classes.container} onClick={onClick}>
      <Text weight={600}>{project.name}</Text>
    </Box>
  );
};
