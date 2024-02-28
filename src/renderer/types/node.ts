import { NodeProps } from "reactflow";
import { Nullish } from "./util";

export type BlockParameterValue = Nullish<string | number | boolean>;

export type BlockDefinition = {
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
      default?: BlockParameterValue;
      options?: Array<string>;
      desc: string | null;
      overload: Record<string, string[]> | null;
    }
  >;
  init_parameters?: BlockDefinition["parameters"];
  pip_dependencies: Array<{ name: string; v: string }>;
  ui_component_id: string;
  children: null;
};

export type CtrlData = Record<
  string,
  BlockDefinition["parameters"] extends infer T
    ? T extends Record<string, infer U>
      ? U & {
          functionName: string;
          param: string;
          value: BlockParameterValue;
        }
      : never
    : never
>;

export type BlockData = {
  id: string;
  label: string;
  type: string;
  func: string;
  path: string;
  running?: boolean;
  failed?: boolean;
  ctrls: CtrlData;
  initCtrls?: CtrlData;
  inputs?: BlockDefinition["inputs"];
  outputs?: Array<{
    name: string;
    id: string;
    type: string;
    desc: string | null;
  }>;
  pip_dependencies?: {
    name: string;
    v?: string;
  }[];
  invalid?: boolean;
};

export type TextData = {
  text: string;
};

export type BlockProps = NodeProps<BlockData>;
