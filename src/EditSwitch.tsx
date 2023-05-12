import { Box, createStyles } from "@mantine/core";
import { IconLock, IconLockOpen } from "@tabler/icons-react";
import ReactSwitch from "react-switch";

const useStyles = createStyles((theme) => {
  return {
    editContainer: {
      display: "flex",
      margin: 10,
      gap: "8px",
      paddingRight: "4px",
    },
  };
});

export const EditSwitch = ({
  isEditMode,
  setIsEditMode,
}: {
  isEditMode: boolean;
  setIsEditMode: Function;
}) => {
  const { classes } = useStyles();
  return (
    <Box className={classes.editContainer}>
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
