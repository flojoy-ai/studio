import { createStyles, useMantineColorScheme } from "@mantine/core";
import { DarkIcon, LightIcon } from "./utils/ThemeIconSvg";

const useStyles = createStyles(() => ({
  toggle: {
    fontSize: 18,
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    marginRight: 10,
  },
}));

export const DarkModeToggle = () => {
  const { classes } = useStyles();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <button onClick={() => toggleColorScheme()} className={classes.toggle}>
      {colorScheme === "dark" ? <LightIcon /> : <DarkIcon />}
    </button>
  );
};
