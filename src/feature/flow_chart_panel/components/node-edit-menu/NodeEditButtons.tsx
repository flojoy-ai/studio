import {Box, createStyles} from "@mantine/core";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { IconPencil, IconX } from "@tabler/icons-react";
const useStyles = createStyles((theme) => ({
    Edit: {
        position: "absolute",
        top: 3,
        right: 3,
        display: "flex",
        cursor: "pointer",
    },
}));

const NodeEditButtons = () => {
  const { setIsEditMode } = useFlowChartState();
  const { classes } = useStyles();

  return (
    <Box className={classes.Edit}>
      <IconPencil onClick={() => setIsEditMode(true)} />
      <IconX onClick={() => setIsEditMode(false)} />
    </Box>
  );
};

export default NodeEditButtons;
