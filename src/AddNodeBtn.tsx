import { createStyles } from "@mantine/core";
import { SetStateAction } from "jotai";
import { Dispatch } from "react";

const useStyles = createStyles((theme) => {
  return {
    addButton: {
      boxSizing: "border-box",
      backgroundColor: theme.colors.accent4[1],
      color: theme.colors.accent4[0],
      border: `1px solid ${theme.colors.accent4[0]}`,
      cursor: "pointer",
    },
  };
});

type AddNodeBtnProps = {
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
};

export const AddNodeBtn = ({ setIsSidebarOpen }: AddNodeBtnProps) => {
  const { classes } = useStyles();

  return (
    <button
      data-testid="add-node-button"
      className={classes.addButton}
      onClick={() => setIsSidebarOpen((prev) => !prev)}
      style={{
        width: "fit-content",
        height: "43px",
        left: "10px",
        top: "110px",
        margin: "10px",
        zIndex: 1,
      }}
    >
      + Add Node
    </button>
  );
};
