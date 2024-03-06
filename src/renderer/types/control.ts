import { NodeProps } from "reactflow";

export type ControlData = {
  blockId: string;
  blockParameter: string;
};

export type ControlProps = NodeProps<ControlData>;

export type WidgetKind = "slider";
