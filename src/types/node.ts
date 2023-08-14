import { OverridePlotData } from "./plotly";
import { NodeProps } from "reactflow";
import { Layout } from "plotly.js";
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
    }
  >;
  init_parameters?: NodeElement["parameters"];
  pip_dependencies: Array<{ name: string; v: string }>;
  ui_component_id: string;
  children: null;
};
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
  initCtrls?: CtrlData;
  inputs?: NodeElement["inputs"];
  outputs?: Array<{
    name: string;
    id: string;
    type: string;
    desc: string | null;
  }>;
  selected?: boolean;
  pip_dependencies?: {
    name: string;
    v?: string;
  }[];
};

export interface CustomNodeProps {
  nodeProps: NodeProps<ElementsData>;
  handleRemove?: (nodeId: string, nodeLabel: string) => void;
  wrapperOnClick?: () => void;
  handleClickExpand?: () => void;
  isRunning?: boolean;
  height?: number | string;
  width?: number | string;
  children?: React.ReactNode;
  nodeError?: string;
  plotlyFig?: {
    data: OverridePlotData;
    layout: Partial<Layout> | undefined;
  };
  textBlob?: string;
  theme?: "light" | "dark";
}
