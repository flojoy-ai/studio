import { useEffect } from "react";
import { useFlowChartState } from "../../hooks/useFlowChartState";
import { useFlowChartGraph } from "../../hooks/useFlowChartGraph";

export function useControlsTabEffects () {
  const { setCtrlsManifest } = useFlowChartState();
  const { nodes } = useFlowChartGraph();

  useEffect( () => {
    if ( nodes.length === 0 ) {
      setCtrlsManifest( [] );
    }
  }, [ nodes ] );
}
