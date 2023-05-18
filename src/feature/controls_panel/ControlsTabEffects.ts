import { useEffect } from "react";
import { useFlowChartState } from "../../hooks/useFlowChartState";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";

export function useControlsTabEffects() {
  const { setCtrlsManifest } = useFlowChartState();
  const { nodes } = useFlowChartGraph();

  useEffect(() => {
    console.log("40");
    if (nodes.length === 0) {
      setCtrlsManifest([]);
    }
  }, [nodes]);
}
