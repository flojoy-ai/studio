import { useMantineColorScheme } from "@mantine/core";
import { DarkIcon, LightIcon } from "./utils/ThemeIconSvg";

export const DarkModeToggle = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <button onClick={() => toggleColorScheme()} className="App-theme-toggle">
      {colorScheme === "dark" ? <LightIcon /> : <DarkIcon />}
    </button>
  );
};
