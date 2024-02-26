import { ElementsData } from "@/renderer/types";
import { TextData } from "@/renderer/types/node";
import { atom, useAtom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { ReactFlowJsonObject, Node } from "reactflow";

export type Project = {
  name?: string;
  rfInstance?: ReactFlowJsonObject<ElementsData>;
  textNodes?: Node<TextData>[];
};

export const projectAtom = atomWithImmer<Project>({});
export const projectPathAtom = atom<string | undefined>(undefined);
export const showWelcomeScreenAtom = atom<boolean>(true);

export const failedNodeAtom = atom<Record<string, string>>({});
export const runningNodeAtom = atom<string>("");
export const nodeStatusAtom = atom((get) => ({
  runningNode: get(runningNodeAtom),
  failedNodes: get(failedNodeAtom),
}));

export const centerPositionAtom = atom<{ x: number; y: number }>({
  x: 0,
  y: 0,
});

export function useFlowChartState() {
  const [runningNode, setRunningNode] = useAtom(runningNodeAtom);
  const [failedNodes, setFailedNodes] = useAtom(failedNodeAtom);

  return {
    runningNode,
    setRunningNode,
    failedNodes,
    setFailedNodes,
  };
}
