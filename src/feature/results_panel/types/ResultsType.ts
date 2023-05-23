import { OverridePlotData } from "@src/feature/common/PlotlyComponent";
import { ElementsData } from "@src/feature/flow_chart_panel/types/CustomNodeProps";
import { Layout } from "plotly.js";

export const ALL_DC_TYPE = [
  "grayscale",
  "matrix",
  "dataframe",
  "image",
  "ordered_pair",
  "ordered_triple",
  "scalar",
  "plotly",
] as const;

export type DataContainterType = (typeof ALL_DC_TYPE)[number];

export interface DataContainer {
  type: DataContainterType;
  x?: number[];
  y?: number[];
  z?: number[];
  t?: number[];
  m?: string;
  c?: number[];
  r?: number[];
  g?: number[];
  b?: number[];
  a?: number[];
  fig?: { data: OverridePlotData };
}

export type ResultIO = {
  cmd: string;
  id: string;
  result: {
    default_fig: {
      data: OverridePlotData;
      layout?: Partial<Layout>;
    };
    data: DataContainer;
  };
};
export interface ResultsType {
  io?: ResultIO[];
}
export type ResultNodeData = ElementsData & {
  resultData?: ResultIO["result"];
};
