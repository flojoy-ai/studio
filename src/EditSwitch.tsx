import { Box, createStyles, Switch, Text } from "@mantine/core";
import { useFlowChartState } from "./hooks/useFlowChartState";

const useStyles = createStyles((theme) => {
  return {
    editContainer: {
      display: "flex",
      margin: 10,
      gap: "8px",
      paddingRight: "4px",
      alignItems: "center",
    },
    editText: {
      color: theme.colors.text[0],
    },
  };
});

export const EditSwitch = () => {
  const { classes } = useStyles();
  const { isEditMode, setIsEditMode } = useFlowChartState();

  return (
    <Box className={classes.editContainer} data-cy="edit-switch">
      <Text size="xs" className={classes.editText}>
        Edit
      </Text>
      <Switch
        checked={isEditMode}
        onChange={() => setIsEditMode(!isEditMode)}
        size="sm"
        color="green"
      />
    </Box>
  );
};
