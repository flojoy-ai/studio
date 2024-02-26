import { BlockData } from "@/renderer/types";
import { TextData } from "@/renderer/types/node";
import { atom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { ReactFlowJsonObject, Node } from "reactflow";

export type Project = {
  name?: string;
  rfInstance?: ReactFlowJsonObject<BlockData>;
  textNodes?: Node<TextData>[];
};

export const projectAtom = atomWithImmer<Project>({});
export const projectPathAtom = atom<string | undefined>(undefined);
export const showWelcomeScreenAtom = atom<boolean>(true);

export const centerPositionAtom = atom<{ x: number; y: number }>({
  x: 0,
  y: 0,
});
