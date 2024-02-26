import { useSocket } from "./useSocket";

export const useNodeStatus = (nodeId: string) => {
  // TODO: Make programResults a map instead for O(1) lookup
  const { failedNodes, runningNode, programResults } = useSocket();

  return {
    nodeError: failedNodes[nodeId],
    nodeRunning: runningNode === nodeId,
    nodeResult: programResults.find((result) => result.id === nodeId),
  };
};
