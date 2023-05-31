import { Box, createStyles } from "@mantine/core";
import { IconLock, IconLockOpen } from "@tabler/icons-react";
import ReactSwitch from "react-switch";
import { useFlowChartState } from "./hooks/useFlowChartState";

const useStyles = createStyles(() => {
  return {
    editContainer: {
      display: "flex",
      margin: 10,
      gap: "8px",
      paddingRight: "4px",
    },
  };
});

export const EditSwitch = () => {
  const { classes } = useStyles();
  const { isEditMode, setIsEditMode } = useFlowChartState();
  return (
    <Box className={classes.editContainer} data-cy="edit-switch">
      {isEditMode ? <IconLock /> : <IconLockOpen />}
      <ReactSwitch
        checked={isEditMode}
        onChange={() => setIsEditMode(!isEditMode)}
        height={22}
        width={50}
      />
    </Box>
  );
};
