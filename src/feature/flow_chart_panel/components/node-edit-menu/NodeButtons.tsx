import { Box, createStyles } from "@mantine/core";
import { IconArrowsMaximize, IconX } from "@tabler/icons-react";
import { SetStateAction } from "jotai";
import { Dispatch } from "react";
import { ElementsData } from "../../types/CustomNodeProps";

const useStyles = createStyles((theme) => ({
  Edit: {
    position: "absolute",
    padding: 4,
    width: "100%",
    zIndex: 150,
    display: "flex",
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

  const handleXButtonClick = () => {
    if (!data.handleRemove) {
      console.error("NodeButtons: handleRemove callback not attached");
      return;
    }
    data.handleRemove(data.id);
  };

  return (
    <Box className={classes.Edit}>
      <Box sx={{ cursor: "pointer" }}>
        <IconArrowsMaximize
          data-testid="expand-button"
          onClick={onNodeExpandClick}
        />
      </Box>
      <Box ml="auto" sx={{ cursor: "pointer" }}>
        <IconX onClick={handleXButtonClick} />
      </Box>
    </Box>
  );
};

export default NodeButtons;
