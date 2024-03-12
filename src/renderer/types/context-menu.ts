import { Node } from "reactflow";

export type MenuInfo<T> = {
  node: Node<T>;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
};
