import { createStyles } from "@mantine/core";
import { Draft } from "immer";
import { Edge, Node } from "reactflow";
import { ElementsData } from "../../types/CustomNodeProps";

const useStyles = createStyles((theme) => {
  return {
    addButton: {
      boxSizing: "border-box",
      backgroundColor: "transparent",
      color: theme.colors.red[8],
      border: `1px solid ${theme.colors.red[8]}`,
      cursor: "pointer",
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
    <button
      data-testid="clear-canvas-btn"
      className={classes.addButton}
      onClick={deleteAllNodes}
      style={{
        width: "fit-content",
        height: "43px",
        left: "10px",
        top: "110px",
        margin: "10px",
        zIndex: 1,
      }}
    >
      Clear Canvas
    </button>
  );
};
