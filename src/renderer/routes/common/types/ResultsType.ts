import { OverridePlotData } from "@/renderer/types";
import { Layout } from "plotly.js";

export type ResultIO = {
  cmd: string;
  id: string;
  result: Result;
};
export type BlockResult = {
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
