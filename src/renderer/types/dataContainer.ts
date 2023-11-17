import { OverridePlotData } from "./plotly";

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
