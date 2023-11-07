import { NodeProps } from "reactflow";

type NodeElement = {
  name: string;
  key: string;
  type: string;
  inputs?: Array<{
    name: string;
    id: string;
    type: string;
    multiple?: boolean;
    desc: string | null;
  }>;

  outputs: Array<{
    name: string;
    id: string;
    type: string;
    desc: string | null;
  }>;
  parameters: Record<
    string,
    {
      type: string;
      default: string | number | boolean | null | undefined;
      options?: Array<string>;
      desc: string | null;
      overload: Record<string, Array<string>> | null;
    }
  >;
  init_parameters?: NodeElement["parameters"];
  pip_dependencies: Array<{ name: string; v: string }>;
  ui_component_id: string;
  children: null;
};

export type CtrlData = Record<
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
  initCtrls?: CtrlData;
  inputs?: NodeElement["inputs"];
  outputs?: Array<{
    name: string;
    id: string;
    type: string;
    desc: string | null;
  }>;
  selected?: boolean; // TODO: Remove this
  pip_dependencies?: {
    name: string;
    v?: string;
  }[];
};

export type TextData = {
  text: string;
};

export type CustomNodeProps = NodeProps<ElementsData>;
