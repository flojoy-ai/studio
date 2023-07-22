import { useMantineColorScheme } from "@mantine/core";
import { Moon, Sun } from "lucide-react";

export const DarkModeToggle = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <button onClick={() => toggleColorScheme()} data-testid="darkmode-toggle">
      {colorScheme === "dark" ? (
        <Moon className="stroke-accent1" />
      ) : (
        <Sun className="stroke-accent1" />
      )}
    </button>
  );
};
