import { useEffect } from "react";
import { useFlowChartState } from "../../hooks/useFlowChartState";

export function useControlsTabEffects(saveAndRunFlowChart) {
  const { setCtrlsManifest, elements } = useFlowChartState();

  useEffect(() => {
    if (elements?.length === 0) {
      setCtrlsManifest([]);
    }
    // } else {
    //   saveAndRunFlowChart();
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements]);
}
