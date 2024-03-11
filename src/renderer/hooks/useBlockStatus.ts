import { useSocketStore } from "@/renderer/stores/socket";
import { useBlockResults } from "./useBlockResults";
import { useEffect, useState } from "react";

export const useBlockStatus = (nodeId: string) => {
  const [runningBlock, setRunningBlock] = useState(
    useSocketStore.getState().runningBlock,
  );
  const [failedBlocks, setFailedBlocks] = useState(
    useSocketStore.getState().failedBlocks,
  );
  useEffect(
    () =>
      useSocketStore.subscribe((state) => {
        setRunningBlock(state.runningBlock);
        setFailedBlocks(state.failedBlocks);
      }),
    [],
  );

  const blockResults = useBlockResults();

  return {
    blockError: failedBlocks[nodeId],
    blockRunning: runningBlock === nodeId,
    blockResult: blockResults[nodeId],
  };
};
