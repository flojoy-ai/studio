import { useEffect } from "react";
import { useResultsTabState } from "./ResultsTabState";
import { ResultIO } from "./types/ResultsType";

export function useResultsTabEffects(nodeResults: ResultIO[] | undefined) {
  const { setResultNodes, nodes } = useResultsTabState();

  useEffect(() => {
    if (nodeResults && nodeResults.length > 0 && nodes.length > 0) {
      setResultNodes(
        nodes.map((node) => ({
          ...node,
          position: node.position, //resultNodePosition[node?.data?.func],
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
