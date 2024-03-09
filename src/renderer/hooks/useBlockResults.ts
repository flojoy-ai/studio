import { useEffect, useState } from "react";
import { useSocketStore } from "@/renderer/stores/socket";

export const useBlockResults = () => {
  const [blockResults, setBlockResults] = useState(
    useSocketStore.getState().blockResults,
  );
  useEffect(
    () =>
      useSocketStore.subscribe((state) => setBlockResults(state.blockResults)),
    [],
  );

  return blockResults;
};
