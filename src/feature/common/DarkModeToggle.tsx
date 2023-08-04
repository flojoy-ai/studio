import { useMantineColorScheme } from "@mantine/core";
import { Button } from "@src/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@src/components/theme-provider";
import { useState } from "react";

export const DarkModeToggle = () => {
  const { toggleColorScheme } = useMantineColorScheme();
  const { setTheme } = useTheme();
  const [mode, setMode] = useState<string>("dark");

  const onClick = () => {
    if (mode === "dark") {
      setTheme("light");
      setMode("light");
    } else {
      setTheme("dark");
      setMode("dark");
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
      {mode === "dark" ? (
        <Moon className="stroke-accent1" />
      ) : (
        <Sun className="stroke-accent1" />
      )}
    </Button>
  );
};
