import { useEffect } from "react";
import { useFlowChartState } from "../../hooks/useFlowChartState";

export function useControlsTabEffects() {
  const { setCtrlsManifest, nodes } = useFlowChartState();

  useEffect(() => {
    console.log("40");
    if (nodes.length === 0) {
      setCtrlsManifest([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes]);
}
