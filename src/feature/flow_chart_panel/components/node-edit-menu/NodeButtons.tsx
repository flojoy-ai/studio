import { Box, createStyles } from "@mantine/core";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { IconArrowsMaximize, IconPencil, IconX } from "@tabler/icons-react";
import { ElementsData } from "../../types/CustomNodeProps";
import { SetStateAction } from "jotai";
import { Dispatch } from "react";

const useStyles = createStyles((theme) => ({
  Edit: {
    position: "absolute",
    top: 6,
    left: 6,
    zIndex: 150,
    display: "flex",
    cursor: "pointer",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.gray[1]
        : theme.colors.dark[8],
  },
}));

type NodeButtonsProps = {
  data: ElementsData;
  setIsExpandMode: Dispatch<SetStateAction<boolean>>;
};

const NodeButtons = ({ data, setIsExpandMode }: NodeButtonsProps) => {
  const { classes } = useStyles();

  const onNodeExpandClick = () => {
    setIsExpandMode(true);
  };

  return (
    <Box className={classes.Edit}>
      <Box mr="auto">
        <IconArrowsMaximize
          data-testid="expand-button"
          onClick={onNodeExpandClick}
        />
      </Box>
      {/* TODO: Add this back. Currently disabled for performance reasons */}
      {/* Can't pass a callback from nodes/nodewrapper themselves because */}
      {/* this would create a dependency on the nodes state. */}
      {/* Have to find a way to attach a callback to each node from the Flow Chart component... */}
      {/* <IconX onClick={() => handleRemove(data.id)} /> */}
    </Box>
  );
};

export default NodeButtons;
