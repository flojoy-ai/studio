import { useEffect } from "react";
import { useFlowChartState } from "../../hooks/useFlowChartState";
import { useFlowChartNodes } from "@src/hooks/useFlowChartNodes";

export function useControlsTabEffects() {
  const { setCtrlsManifest } = useFlowChartState();
  const { nodes } = useFlowChartNodes();

  useEffect(() => {
    console.log("40");
    if (nodes.length === 0) {
      setCtrlsManifest([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes]);
}
