import { useState } from "react";
import { Node } from "reactflow";
import { useFlowChartState } from "../../hooks/useFlowChartState";

export function useResultsTabState() {
  const [resultNodes, setResultNodes] = useState<Node[]>([]);
  const { nodes } = useFlowChartState();

  return {
    resultNodes,
    setResultNodes,
    nodes,
  };
}

export type ResultTabStateReturnType = ReturnType<typeof useResultsTabState>;
