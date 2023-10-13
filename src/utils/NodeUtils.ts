import { v4 as uuidv4 } from "uuid";

export const createNodeId = (nodeFunc: string) => `${nodeFunc}-${uuidv4()}`;

export const createNodeLabel = (nodeFunc: string, existingCount: number) => {
  let nodeLabel: string;

  if (nodeFunc === "CONSTANT") {
    nodeLabel = "3.0";
  } else {
    nodeLabel = existingCount > 0 ? `${nodeFunc} ${existingCount}` : nodeFunc;
  }

  return nodeLabel.replaceAll("_", " ");
};
