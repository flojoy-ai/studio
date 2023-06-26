import { useEffect } from "react";
import { Node } from "reactflow";
import { ResultsType } from "../common//types/ResultsType";
import { FlowChartTabStateReturnType } from "./FlowChartTabState";
import { ElementsData } from "./types/CustomNodeProps";

export function useFlowChartTabEffects({
  results,
  selectedNode,
  setNd,
}: FlowChartTabStateReturnType & {
  results: ResultsType | null;
  selectedNode: Node<ElementsData> | null;
}) {
  useEffect(() => {
    if (results?.io) {
      const runResults = results.io;
      const filteredResult = runResults.filter(
        (node) => node.id === selectedNode?.id
      )[0];
      setNd(filteredResult ?? null);
    }
  }, [results, selectedNode]);
}
