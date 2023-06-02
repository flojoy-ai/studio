import { useEffect } from "react";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { useControlsState } from "@src/hooks/useControlsState";

export function useControlsTabEffects() {
  const { setCtrlsManifest } = useControlsState();
  const { nodes } = useFlowChartGraph();

  useEffect(() => {
    if (nodes.length === 0) {
      setCtrlsManifest([]);
    }
  }, [nodes]);
}
