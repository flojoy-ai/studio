import { useState, useMemo } from "react";
import { useWindowSize } from "react-use";
import { useFlowChartState } from "../../hooks/useFlowChartState";

export function useTemplateState() {
  const { width: windowWidth } = useWindowSize();
  const { rfInstance } = useFlowChartState();
  const [resultElements, setResultElements] = useState<any[]>([]);
  const nodeResults = useMemo(
    () => ("io" in results ? JSON.parse(results.io).reverse() : []),
    [results]
  );
  const [a, setA] = useState<string>('');
  const [result, setResult, isLoading] = useReactQuery();

  // actions to change state
  const setPropertyA = (a) => {
    setA(a);
    setResult(a + result.a)
  };

  return {
    propertyA: a,
    propertyB: b,
    result,
    isLoadingResult: isLoading,
    setPropertyA,
  };
}

function useReactQuery(): [any, any, boolean] {
    throw new Error("Function not implemented.");
}

