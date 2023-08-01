import {
  Box,
  createStyles,
  Switch,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { useFlowChartState } from "@src/hooks/useFlowChartState";

const useStyles = createStyles(() => ({
  container: {
    display: "flex",
    margin: 10,
    paddingRight: 4,
    gap: 8,
    alignItems: "center",
  },
}));

export const EditSwitch = () => {
  const { classes } = useStyles();
  const { isEditMode, setIsEditMode } = useFlowChartState();
  const theme = useMantineTheme();

  return (
    <div
      className={classes.container}
      data-cy="edit-switch"
      id="edit-switch-wrapper"
    >
      <Text size="sm" color={theme.colors.text[0]} id="edit-switch-text">
        Edit
      </Text>
      <Switch
        checked={isEditMode}
        onChange={() => setIsEditMode(!isEditMode)}
        size="sm"
        color="gray"
        onLabel={<IconCheck size={16} color={theme.colors.accent1[0]} />}
        id="edit-switch"
      />
    </div>
  );
};
