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
  onClick: () => void;
};

export const ProjectComponent = ({
  project,
  onClick,
}: ProjectComponentProps) => {
  const { classes } = useStyles();

  return (
    <Box className={classes.container} onClick={onClick}>
      <Text weight={600}>{project.name}</Text>
    </Box>
  );
};
