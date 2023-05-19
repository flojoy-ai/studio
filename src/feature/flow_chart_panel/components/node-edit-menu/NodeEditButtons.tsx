import { Box, createStyles } from "@mantine/core";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { IconArrowsMaximize, IconPencil, IconX } from "@tabler/icons-react";
import { ElementsData } from "../../types/CustomNodeProps";

const useStyles = createStyles((theme) => ({
  Edit: {
    position: "absolute",
    top: 7,
    right: 3,
    zIndex: 150,
    display: "flex",
    cursor: "pointer",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.gray[1]
        : theme.colors.dark[8],
  },
  leftEdit: {
    position: "absolute",
    top: 8,
    left: 7,
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
  const { setIsEditMode, setIsExpandMode } = useFlowChartState();
  const { classes } = useStyles();

  const onNodeExpandClick = () => {
    setIsExpandMode(true);
  };

  return (
    <div>
      <Box className={classes.leftEdit}>
        <IconArrowsMaximize onClick={onNodeExpandClick} />
        {showPencil && <IconPencil onClick={() => setIsEditMode(true)} />}
      </Box>
      <Box className={classes.Edit}>
        <IconX onClick={() => handleRemove(data.id)} />
      </Box>
    </div>
  );
};

export default NodeEditButtons;
