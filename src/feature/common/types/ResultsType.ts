import { OverridePlotData } from "@/types";
import { Layout } from "plotly.js";
import { Vec3, Vec4 } from "regl";

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
  data?: ScalarData | OrderedPairData | OrderedTripleData;
};

export type ScalarData = {
  c: number;
};

export type OrderedPairData = {
  x: number[];
  y: number[];
};

export type OrderedTripleData = {
  v: Vec3[];
  extra?: {
    colors: Vec4[];
  };
};
