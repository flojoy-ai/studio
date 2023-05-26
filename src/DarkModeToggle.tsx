import { createStyles, useMantineColorScheme } from "@mantine/core";
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

  return (
    <button
      onClick={() => toggleColorScheme()}
      className={classes.toggle}
      data-testid="darkmode-toggle"
    >
      {colorScheme === "dark" ? <LightIcon /> : <DarkIcon />}
    </button>
  );
};
