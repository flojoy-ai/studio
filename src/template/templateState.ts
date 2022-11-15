import { useState } from "react";

/**
 * This is an example custom hook that manages a composition of states which can be local/global state.
 * @returns sample state
 */
export function useTemplateState() {
  // state
  const [a, setA] = useState<string>('');
  const [b, setB] = useGlobalStateB(); // jotai or redux state
  const [result, setResult, isLoading] = useReactQuery();

  // actions to change state
  const setPropertyA = (a) => {
    setA(a);
    setResult(a + result.a)
  };
  const setPropertyB = (b) => {
    setB(b);
  };

  return {
    propertyA: a,
    propertyB: b,
    result,
    isLoadingResult: isLoading,
    setPropertyA,
    setPropertyB,
  };
}

function useGlobalStateB(): [any, any] {
    throw new Error("Function not implemented.");
}

function useReactQuery(): [any, any, boolean] {
    throw new Error("Function not implemented.");
}

