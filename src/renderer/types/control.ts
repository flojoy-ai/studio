// import { NodeProps } from "reactflow";

import { NodeProps } from "reactflow";

// type WidgetConfig = {
//   type: WidgetType;
// };

// export type SliderConfig = {
//   type: "slider";
//   min: number;
//   max: number;
//   step?: number;
// };
//
// export type ControlData<T extends WidgetConfig> = {
//   blockId: string;
//   blockParameter: string;
//   config: T;
// };

// export type ControlProps<T extends WidgetConfig> = NodeProps<ControlData<T>>;

export type WidgetData = {
  blockId: string;
  blockParameter: string;
};

export type WidgetType = "slider";

export type VisualizationType =
  | "scatter"
  | "histogram"
  | "line"
  | "surface3d"
  | "scatter3d"
  | "bar"
  | "table"
  | "image"
  | "box"
  | "big_number"
  | "matrix_view"
  | "array_view";

export type VisualizationData = {
  blockId: string;
  visualizationType: string;
};

export type WidgetProps = NodeProps<WidgetData>;
