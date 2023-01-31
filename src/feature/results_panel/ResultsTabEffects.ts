import { useEffect } from "react";
import { ResultTabStateReturnType } from "./ResultsTabState";
import { ResultIO } from "./types/ResultsType";

export function useResultsTabEffects({
  nodeResults,
  setResultNodes,
  nodes,
}: ResultTabStateReturnType & { nodeResults: ResultIO[] }) {
  useEffect(() => {
    if (nodeResults && nodeResults.length > 0 && nodes.length > 0) {
      setResultNodes(
        nodes.map((node) => ({
          ...node,
          position: node.position,
          data: {
            ...node.data,
            resultData: nodeResults?.find((result) => result.id === node.id)
              ?.result,
          },
        }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeResults, nodes]);
}
