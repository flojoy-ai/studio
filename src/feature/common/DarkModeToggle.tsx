import { useMantineColorScheme } from "@mantine/core";
import { Button } from "@src/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@src/components/theme-provider";

export const DarkModeToggle = () => {
  const { toggleColorScheme } = useMantineColorScheme();
  const { theme, setTheme } = useTheme();

  const onClick = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={() => {
        toggleColorScheme();
        onClick();
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
