import { DataContainer } from "./dataContainer";
import { PlotData, Layout } from "plotly.js";
import type { PlotParams } from "react-plotly.js";

export type DataContainer2PlotlyProps = {
  dataContainer: DataContainer;
  plotType: PlotData["type"];
  plotMode?: PlotData["mode"];
  theme: "dark" | "light";
  fig?: OverridePlotData;
};

export type OverridePlotData = Array<
  Partial<PlotData> & {
    header?: {
      values?: any[];
      fill: {
        color: string;
      };
    };
    cells?: {
      values?: any[];
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
