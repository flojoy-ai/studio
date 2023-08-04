import { useMantineColorScheme } from "@mantine/core";
import { Button } from "@src/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@src/components/theme-provider";

export const DarkModeToggle = () => {
  const { toggleColorScheme } = useMantineColorScheme();
  const { setTheme } = useTheme();

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={() => {
        toggleColorScheme();
        setTheme("light");
      }}
      data-testid="darkmode-toggle"
    >
      {/* {theme === "dark" ? (
        <Moon className="stroke-accent1" />
      ) : (
        <Sun className="stroke-accent1" />
      )} */}
    </Button>
  );
};
