import { Button, createStyles } from "@mantine/core";
import { SetStateAction } from "jotai";
import { Dispatch } from "react";

const useStyles = createStyles((theme) => {
  const accent =
    theme.colorScheme === "dark" ? theme.colors.accent1 : theme.colors.accent2;
  return {
    button: {
      width: "fit-content",
      height: "43px",
      margin: "10px",
      boxSizing: "border-box",
      backgroundColor: theme.colors.accent4[1],
      color: theme.colors.accent4[0],
      border: `1px solid ${theme.colors.accent4[0]}`,
      cursor: "pointer",
      zIndex: 100,
      fontWeight: 600,
      "&:hover": {
        backgroundColor: accent[1] + "36",
      },
    },
  };
});

type AddNodeBtnProps = {
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
};

export const AddNodeBtn = ({ setIsSidebarOpen }: AddNodeBtnProps) => {
  const { classes } = useStyles();

  return (
    <Button
      data-testid="add-node-button"
      className={classes.button}
      onClick={() => setIsSidebarOpen((prev) => !prev)}
    >
      + Add Node
    </Button>
  );
};
