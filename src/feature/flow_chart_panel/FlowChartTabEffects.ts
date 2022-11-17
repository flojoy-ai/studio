import { useEffect } from "react";
import { useFlowChartState } from "../../hooks/useFlowChartState";
import { saveFlowChartToLocalStorage } from "../../services/FlowChartServices";

export function useFlowChartTabEffects() {
  const { rfInstance } = useFlowChartState();
  useEffect(() => {
    saveFlowChartToLocalStorage(rfInstance);
  }, [rfInstance]);
}