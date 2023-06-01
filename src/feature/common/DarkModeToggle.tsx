import {
  createStyles,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { DarkIcon, LightIcon } from "./utils/ThemeIconSvg";

const useStyles = createStyles(() => ({
  toggle: {
    fontSize: 18,
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    marginRight: 10,
    display: "flex",
    alignItems: "center",
  },
}));

export const DarkModeToggle = () => {
  const { classes } = useStyles();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const color =
    theme.colorScheme === "dark"
      ? theme.colors.accent1[0]
      : theme.colors.accent3[0];

  return (
    <button
      onClick={() => toggleColorScheme()}
      className={classes.toggle}
      data-testid="darkmode-toggle"
    >
      {colorScheme === "dark" ? (
        <DarkIcon color={color} />
      ) : (
        <LightIcon color={color} />
      )}
    </button>
  );
};
