import { OverridePlotData } from "@/types";
import { Layout } from "plotly.js";

export type ResultIO = {
  cmd: string;
  id: string;
  result: Result;
};
export type NodeResult = {
  cmd: string;
  id: string;
  result: Result;
};

export type Result = {
  plotly_fig?: {
    data: OverridePlotData;
    layout: Partial<Layout> | undefined;
  };
  text_blob?: string;
  data?: ScalarData | OrderedPairData;
};

export type ScalarData = {
  c: number;
};

export type OrderedPairData = {
  x: number[];
  y: number[];
};
