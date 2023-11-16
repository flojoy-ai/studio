import { OverridePlotData } from "@src/types";
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
  data?: ScalarData;
};

export type ScalarData = {
  c: number;
};
