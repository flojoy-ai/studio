import { useEffect } from "react";
import { ResultTabStateReturnType } from "./ResultsTabState";
import { ResultIO } from "./types/ResultsType";
import { Node } from "reactflow";
import { ElementsData } from "../flow_chart_panel/types/CustomNodeProps";

export function useResultsTabEffects({
  nodeResults,
  setResultNodes,
  nodes,
}: ResultTabStateReturnType & {
  nodes: Node<ElementsData>[];
  nodeResults: ResultIO[];
}) {
  useEffect(() => {
    if (nodeResults && nodeResults.length > 0 && nodes.length > 0) {
      setResultNodes(
        nodes.map((node) => {
          const nodeResult = nodeResults?.find(
            (result) => result.id === node.id
          );
          return {
            ...node,
            type: "default",
            position: node.position,
            data: {
              ...node.data,
              resultData: nodeResult?.result,
            },
          };
        })
      );
    }
  }, [nodeResults, nodes]);
}
