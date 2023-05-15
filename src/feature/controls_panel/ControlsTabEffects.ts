import { useEffect } from "react";
import { useFlowChartState } from "../../hooks/useFlowChartState";

export function useControlsTabEffects() {
  const { setCtrlsManifest, rfInstance } = useFlowChartState();

  // useEffect(() => {
  //   if (rfInstance?.nodes.length === 0) {
  //     setCtrlsManifest([]);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [rfInstance?.nodes]);
}
