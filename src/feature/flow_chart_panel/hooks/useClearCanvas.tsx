import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { useHasUnsavedChanges } from "@src/hooks/useHasUnsavedChanges";
import { useSocket } from "@src/hooks/useSocket";
import { sendEventToMix } from "@src/services/MixpanelServices";
import { useCallback } from "react";

type ClearCanvasHook = () => () => void;

const useClearCanvas: ClearCanvasHook = () => {
  const { setNodes, setEdges } = useFlowChartGraph();
  const { setHasUnsavedChanges } = useHasUnsavedChanges();
  const { states } = useSocket();
  const { setProgramResults } = states;

  const clearCanvas = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setHasUnsavedChanges(true);
    setProgramResults([]);

    sendEventToMix("Canvas cleared", "");
  }, [setNodes, setEdges, setHasUnsavedChanges, setProgramResults]);

  return clearCanvas;
};

export default useClearCanvas;
