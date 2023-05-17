import { Box, createStyles } from "@mantine/core";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { IconPencil, IconX } from "@tabler/icons-react";
import { ElementsData } from "../../types/CustomNodeProps";
const useStyles = createStyles((theme) => ({
  Edit: {
    position: "absolute",
    top: 10,
    right: 3,
    zIndex: 150,
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
  handleRemove: (id: string) => void;
  showPencil: boolean;
};

const NodeEditButtons = ({
  data,
  handleRemove,
  showPencil,
}: NodeEditButtonsProps) => {
  const { setIsEditMode } = useFlowChartState();
  const { classes } = useStyles();

  return (
    <Box className={classes.Edit}>
      {showPencil && <IconPencil onClick={() => setIsEditMode(true)} />}
      <IconX onClick={() => handleRemove(data.id)} />
    </Box>
  );
};

export default NodeEditButtons;
