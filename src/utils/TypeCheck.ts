import { Connection } from "reactflow";
import { Leaf, RootNode, ParentNode } from "./ManifestLoader";

const allNodes: Map<string, Leaf> = new Map();

const populateNodes = (node: RootNode | ParentNode) => {
  const dfs = (node: ParentNode | Leaf, map: Map<string, Leaf>) => {
    if (!node.children) {
      allNodes.set(node.key, node);
      return;
    }

    for (const child of node.children) {
      dfs(child, map);
    }
  };

  node.children.map((c) => dfs(c, allNodes));
};

const getNodeNameFromId = (nodeId: string) => {
  return nodeId.split("-", 1)[0];
};

export const getEdgeTypes = (
  nodeSection: RootNode,
  connection: Connection,
): [string, string] => {
  populateNodes(nodeSection);
  if (
    !connection.source ||
    !connection.target ||
    !connection.targetHandle ||
    !connection.sourceHandle
  )
    throw new Error(
      "connection.source, connection.target, connection.targetHandle, and connection.sourceHandle must all be non-null",
    );

  const sourceNode = allNodes.get(getNodeNameFromId(connection.source));
  const targetNode = allNodes.get(getNodeNameFromId(connection.target));

  const source = sourceNode?.outputs?.find(
    (o) => o.id === connection.sourceHandle,
  );
  const target = targetNode?.inputs?.find(
    (i) => i.id === connection.targetHandle,
  );

  if (!source || !target) {
    throw new Error("Missing source or target in connection");
  }

  return [source.type, target.type];
};

const intersection = <T>(a: Set<T>, b: Set<T>) => {
  return new Set([...a].filter((i) => b.has(i)));
};

export const isCompatibleType = (left: string, right: string): boolean => {
  if (left === "Any" || right === "Any") return true;

  const leftTypes = new Set(left.split("|"));
  const rightTypes = new Set(right.split("|"));

  return intersection(leftTypes, rightTypes).size > 0;
};
