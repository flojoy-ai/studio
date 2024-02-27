import { ReactFlowJsonObject, Node } from "reactflow";
import { TextData, BlockData } from "./node";

export type Project = {
  name?: string;
  rfInstance: ReactFlowJsonObject<BlockData>;
  textNodes?: Node<TextData>[];
};
