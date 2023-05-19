import { createStyles } from "@mantine/core";
import { useFlowChartState } from "@src/hooks/useFlowChartState";

const useStyles = createStyles((theme) => {
  return {
    addButton: {
      boxSizing: "border-box",
      backgroundColor: "transparent",
      color: "red",
      border: "1px solid red",
      cursor: "pointer",
    },
  };
});

export const ClearCanvasBtn = () => {
  const { classes } = useStyles();
  const { setNodes, setEdges } = useFlowChartState();
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
