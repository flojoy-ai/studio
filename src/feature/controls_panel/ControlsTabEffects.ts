import { useCallback, useEffect } from "react";
import { useFlowChartState } from "../../hooks/useFlowChartState";
import { useControlsTabState } from "./ControlsTabState";
import { saveAndRunFlowChartInServer } from "../../services/FlowChartServices";

export function useControlsTabEffects() {
    const { debouncedTimerId, setDebouncedTimerId } = useControlsTabState();
    const { setCtrlsManifest, rfInstance } = useFlowChartState();

    const saveAndRunFlowChart = useCallback(() => {
        // save and run the script with debouncing
        if (debouncedTimerId) {
            clearTimeout(debouncedTimerId);
        }
        const timerId = setTimeout(() => {
            saveAndRunFlowChartInServer(rfInstance);
        }, 700);

        setDebouncedTimerId(timerId);
    }, [debouncedTimerId, rfInstance]);

    useEffect(() => {
        if (rfInstance?.elements.length === 0) {
            setCtrlsManifest([]);
        } else {
            saveAndRunFlowChart();
        }
    }, [rfInstance]);
}