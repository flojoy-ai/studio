import { useState } from "react";
import { Node } from "reactflow";
import { useFlowChartState } from "../../hooks/useFlowChartState";

export function useResultsTabState() {
  const [resultNodes, setResultNodes] = useState<Node[]>([]);

  return {
    resultNodes,
    setResultNodes,
  };
}

export type ResultTabStateReturnType = ReturnType<typeof useResultsTabState>;
