import { useEffect } from "react";
import { useResultsTabState } from "./ResultsTabState";
import { resultNodePosition } from "./NODE_POSITION";

export function useResultsTabEffects(nodeResults) {
    const { resultElements, setResultElements, rfInstance } = useResultsTabState();

    useEffect(() => {
        if (nodeResults && nodeResults.length > 0 && rfInstance) {
            setResultElements(
                rfInstance?.elements.map((elem) => ({
                    ...elem,
                    position: resultNodePosition[elem?.data?.func],
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
    }, [nodeResults, rfInstance]);
}
