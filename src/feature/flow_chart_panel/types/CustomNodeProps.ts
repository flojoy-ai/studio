import { NodeElement } from "@src/utils/ManifestLoader";

type CtrlData = Record<
  string,
  NodeElement["parameters"] extends infer T
    ? T extends Record<string, infer U>
      ? U & {
          functionName: string;
          param: string;
          value: string | boolean | number | undefined | null;
        }
      : never
    : never
>;

export type ElementsData = {
  id: string;
  label: string;
  type: string;
  func: string;
  path: string;
  running?: boolean;
  failed?: boolean;
  ctrls: CtrlData;
  inputs?: Array<{ name: string; id: string; type: string }>;
  outputs?: Array<{ name: string; id: string; type: string }>;
  selected?: boolean;
  pip_dependencies?: {
    name: string;
    v?: string;
  }[];
};

export interface CustomNodeProps {
  data: ElementsData;
  handleRemove: (nodeId: string, nodeLabel: string) => void;
}
