import { ReactFlowJsonObject, Node } from "reactflow";
import { TextData, BlockData } from "@/renderer/types/node";

export type Project = {
  name?: string;
  rfInstance: ReactFlowJsonObject<BlockData>;
  textNodes?: Node<TextData>[];
};
