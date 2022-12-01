import { useCallback, useEffect } from "react";
import { useFlowChartState } from "../../hooks/useFlowChartState";
import { useControlsTabState } from "./ControlsTabState";
import { saveAndRunFlowChartInServer } from "../../services/FlowChartServices"

export function useControlsTabEffects() {
    const { debouncedTimerId, setDebouncedTimerId } = useControlsTabState();
    const { setCtrlsManifest, rfInstance } = useFlowChartState();

    // useEffect(() => {
    //     if (rfInstance?.elements.length === 0) {
    //         setCtrlsManifest([]);
    //     } else {
    //         saveAndRunFlowChart();
    //     }
    // }, [rfInstance]);
}