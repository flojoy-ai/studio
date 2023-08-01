import { Button, createStyles } from "@mantine/core";
import { Draft } from "immer";
import { Edge, Node } from "reactflow";
import { ElementsData } from "flojoy/types";

const useStyles = createStyles((theme) => {
  return {
    button: {
      width: "fit-content",
      height: "43px",
      margin: "10px",
      boxSizing: "border-box",
      backgroundColor: "transparent",
      color: theme.colors.red[8],
      border: `1px solid ${theme.colors.red[8]}`,
      cursor: "pointer",
      zIndex: 100,
      fontWeight: 600,
      "&:hover": {
        backgroundColor: theme.colors.red[8] + "36",
      },
    },
  };
});

type ClearCanvasBtnProps = {
  setNodes: (
    update:
      | Node<ElementsData>[]
      | ((draft: Draft<Node<ElementsData>>[]) => void)
  ) => void;
  setEdges: (update: Edge[] | ((draft: Draft<Edge>[]) => void)) => void;
};

export const ClearCanvasBtn = ({ setNodes, setEdges }: ClearCanvasBtnProps) => {
  const { classes } = useStyles();

  const deleteAllNodes = () => {
    setNodes([]);
    setEdges([]);
  };

  return (
    <Button
      data-testid="clear-canvas-btn"
      className={classes.button}
      onClick={deleteAllNodes}
    >
      Clear Canvas
    </Button>
  );
};
