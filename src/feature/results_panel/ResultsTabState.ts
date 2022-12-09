import { useState } from "react";
import { useFlowChartState } from "../../hooks/useFlowChartState";

export function useResultsTabState() {
  const [resultElements, setResultElements] = useState<any[]>([]);
  const { elements } = useFlowChartState();

  return {
    resultElements,
    setResultElements,
    elements,
  };
}
