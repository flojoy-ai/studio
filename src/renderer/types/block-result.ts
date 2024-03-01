import { OverridePlotData } from "@/renderer/types";
import { Layout } from "plotly.js";

export type BlockResult = {
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
