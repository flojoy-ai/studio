import { useSocket } from "./useSocket";

export const useNodeStatus = (nodeId: string) => {
  const { failedNodes, runningNode, blockResults } = useSocket();

  return {
    nodeError: failedNodes[nodeId],
    nodeRunning: runningNode === nodeId,
    nodeResult: blockResults[nodeId],
  };
};
