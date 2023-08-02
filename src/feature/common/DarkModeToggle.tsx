import { useMantineColorScheme } from "@mantine/core";
import { Button } from "@src/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@src/themeContext";

export const DarkModeToggle = () => {
  const { toggleColorScheme } = useMantineColorScheme();
  const { toggleTheme, theme } = useTheme();

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={() => {
        toggleColorScheme();
        toggleTheme();
      }}
      data-testid="darkmode-toggle"
    >
      {theme === "dark" ? (
        <Moon className="stroke-accent1" />
      ) : (
        <Sun className="stroke-accent1" />
      )}
    </Button>
  );
};
