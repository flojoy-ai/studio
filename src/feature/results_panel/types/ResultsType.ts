import { OverridePlotData } from "@src/feature/common/PlotlyComponent";
import { ElementsData } from "@src/feature/flow_chart_panel/types/CustomNodeProps";

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

export type DataContainerType = (typeof ALL_DC_TYPE)[number];

export interface DataContainer {
  type: DataContainerType;
  data:
    | GrayscaleData
    | MatrixData
    | DataFrameData
    | ImageData
    | OrderedPairData
    | OrderedTripleData
    | ScalarData
    | OverridePlotData;
}

export interface GrayscaleData {
  m: number[];
}

export interface MatrixData {
  m: number[];
}

export interface DataFrameData {
  m: string;
}

export interface ImageData {
  r: number[];
  g: number[];
  b: number[];
  a: number[];
}

export interface OrderedPairData {
  x: number[];
  y: number[];
}

export interface OrderedTripleData {
  x: number[];
  y: number[];
  z: number[];
}

export interface ScalarData {
  c: number[];
}

export type ResultIO = {
  cmd: string;
  id: string;
  result: Result;
};

export type Result = {
  default_fig: {
    data: OverridePlotData;
  };
  data: DataContainer;
};

export interface ResultsType {
  io?: ResultIO[];
}
export type ResultNodeData = ElementsData & {
  resultData?: ResultIO["result"];
};
