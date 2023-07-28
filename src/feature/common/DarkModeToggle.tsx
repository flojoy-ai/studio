import { useMantineColorScheme } from "@mantine/core";
import { Button } from "@src/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@src/themeContext";

export const DarkModeToggle = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { toggleTheme, theme } = useTheme();

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={() => toggleColorScheme()}
      data-testid="darkmode-toggle"
    >
      {colorScheme === "dark" ? (
        <Moon className="stroke-accent1" />
      ) : (
        <Sun className="stroke-accent1" />
      )}
    </Button>
    // <Button size="icon" variant="ghost" onClick={toggleTheme} data-testid="darkmode-toggle">
    //   {/* Toggle theme to {theme === "light" ? "dark" : "light"} */}
    //   {theme === "dark" ? (
    //     <Moon className="stroke-accent1" />
    //   ) : (
    //     <Sun className="stroke-accent1" />
    //   )}
    // </Button>
  );
};
