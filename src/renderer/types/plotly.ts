import { PlotData, Layout } from "plotly.js";
import type { PlotParams } from "react-plotly.js";

export type OverridePlotData = Array<
  Partial<PlotData> & {
    header?: {
      values?: unknown[];
      fill: {
        color: string;
      };
    };
    cells?: {
      values?: unknown[];
      fill: { color: string };
    };
  }
>;

export type PlotProps = {
  data: OverridePlotData;
  isThumbnail?: boolean;
  layout: Partial<Layout>;
  theme?: "light" | "dark";
  id?: string;
} & Omit<PlotParams, "data">;
