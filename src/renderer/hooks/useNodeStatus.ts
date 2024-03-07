import { useSocketStore } from "@/renderer/stores/socket";
import { useBlockResults } from "./useBlockResults";
import { useEffect, useRef } from "react";

export const useBlockStatus = (nodeId: string) => {
  const runningBlock = useRef(useSocketStore.getState().runningBlock);
  useEffect(
    () =>
      useSocketStore.subscribe(
        (state) => (runningBlock.current = state.runningBlock),
      ),
    [],
  );
  const failedBlocks = useRef(useSocketStore.getState().failedBlocks);
  useEffect(
    () =>
      useSocketStore.subscribe(
        (state) => (failedBlocks.current = state.failedBlocks),
      ),
    [],
  );

  const blockResults = useBlockResults();

  return {
    blockError: failedBlocks.current[nodeId],
    blockRunning: runningBlock.current === nodeId,
    blockResult: blockResults[nodeId],
  };
};
