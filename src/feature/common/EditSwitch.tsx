import {
  Box,
  createStyles,
  Switch,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
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
  const theme = useMantineTheme();

  return (
    <Box className={classes.editContainer} data-cy="edit-switch">
      <Text size="sm" className={classes.editText}>
        Edit
      </Text>
      <Switch
        checked={isEditMode}
        onChange={() => setIsEditMode(!isEditMode)}
        size="sm"
        color="gray"
        onLabel={<IconCheck size={16} color={theme.colors.accent1[0]} />}
      />
    </Box>
  );
};
