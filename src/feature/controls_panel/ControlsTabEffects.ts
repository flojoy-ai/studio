import { useEffect } from "react";
import { useFlowChartState } from "../../hooks/useFlowChartState";

export function useControlsTabEffects(saveAndRunFlowChart) {
  const { setCtrlsManifest, rfInstance } = useFlowChartState();

  useEffect(() => {
    if (rfInstance?.elements.length === 0) {
      setCtrlsManifest([]);
    }
      // } else {
    //   saveAndRunFlowChart();
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rfInstance]);
}
