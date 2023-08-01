import { useMantineColorScheme } from "@mantine/core";
import { Button } from "@src/components/ui/button";
import { Moon, Sun } from "lucide-react";

export const DarkModeToggle = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

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
  );
};
