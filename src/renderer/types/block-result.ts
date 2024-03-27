import { OverridePlotData } from "@/renderer/types/plotly";
import { Layout } from "plotly.js";
import { DataContainer } from "./data-container";

export type BlockResult = {
  plotly_fig?: {
    data: OverridePlotData;
    layout: Partial<Layout> | undefined;
  };
  text_blob?: string;
  data?: DataContainer;
};
