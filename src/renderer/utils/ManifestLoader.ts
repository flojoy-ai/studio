import {
  TreeNode,
  Leaf,
  ParentNode,
  LeafParentNode,
  RootNode,
} from "@/renderer/types/manifest";

export function isLeaf(obj: TreeNode): obj is Leaf {
  return Boolean(
    obj?.name && (obj as Leaf).key && (obj as Leaf).type && !obj.children,
  );
}

export function isParentNode(obj: TreeNode): obj is ParentNode {
  return Boolean(obj?.name && Array.isArray(obj.children));
}
export function isLeafParentNode(obj: TreeNode): obj is LeafParentNode {
  return (
    obj &&
    Array.isArray(obj.children) &&
    obj.children.every((child) => isLeaf(child))
  );
}

export function isRoot(obj: TreeNode): obj is RootNode {
  return obj && obj.name === "ROOT";
}
