import { useState } from "react";

export function useTemplateState() {
  const [resultElements, setResultElements] = useState<any[]>([]);
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

