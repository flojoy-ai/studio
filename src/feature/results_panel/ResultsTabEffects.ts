import { useEffect } from "react";
import { useResultsTabState } from "./ResultsTabState";

export function useResultsTabEffects(nodeResults) {
  const { setResultElements, elements } = useResultsTabState();

  useEffect(() => {
    if (nodeResults && nodeResults.length > 0 && elements.length > 0) {
      setResultElements(
        elements.map((elem: any) => ({
          ...elem,
          position: elem.position, //resultNodePosition[elem?.data?.func],
          data: {
            ...elem.data,
            ...(!("source" in elem) && {
              resultData: nodeResults?.find((result) => result.id === elem.id)
                ?.result,
            }),
          },
        }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeResults, elements]);
}
