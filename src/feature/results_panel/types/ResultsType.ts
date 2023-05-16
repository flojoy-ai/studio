import { ElementsData } from "@src/feature/flow_chart_panel/types/CustomNodeProps";
import { Data, PlotData } from "plotly.js";

export type ResultIO = {
  cmd: string;
  id: string;
  result: {
    default_fig: {
      data: Partial<PlotData>[];
    };
    data: {
      type: string;
      [key: string]: any;
    };
  };
};
export interface ResultsType {
  io?: ResultIO[];
}
export type ResultNodeData = ElementsData & {
  resultData?: ResultIO["result"];
};
