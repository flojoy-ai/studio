import { Box, createStyles } from "@mantine/core";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { IconPencil, IconX } from "@tabler/icons-react";
import { ElementsData } from "../../types/CustomNodeProps";
const useStyles = createStyles((theme) => ({
  Edit: {
    position: "absolute",
    top: 4,
    right: 4,
    zIndex: 10,
    display: "flex",
    cursor: "pointer",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.gray[1]
        : theme.colors.dark[8],
  },
}));

type NodeEditButtonsProps = {
  data: ElementsData;
  showPencil: boolean;
};

const NodeEditButtons = ({ data, showPencil }: NodeEditButtonsProps) => {
  const { setIsEditMode } = useFlowChartState();
  const { classes } = useStyles();

  return (
    <Box className={classes.Edit}>
      {showPencil && <IconPencil onClick={() => setIsEditMode(true)} />}
      {/* TODO: Add this back. Currently disabled for performance reasons */}
      {/* Can't pass a callback from nodes/nodewrapper themselves because */}
      {/* this would create a dependency on the nodes state. */}
      {/* Have to find a way to attach a callback to each node from the Flow Chart component... */}
      {/* <IconX onClick={() => handleRemove(data.id)} /> */}
    </Box>
  );
};

export default NodeEditButtons;
