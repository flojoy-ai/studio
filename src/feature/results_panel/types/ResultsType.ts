import { ElementsData } from "@src/feature/flow_chart_panel/types/CustomNodeProps";
import { PlotType, PlotData } from "plotly.js";

export type ResultIO = {
  cmd: string;
  id: string;
  result: {
    type?: PlotType;
    file_type?:string[];
    source?:string;
    x?: number[] | undefined;
    y?: number[] | Array<number[]> | undefined;
    z?: number[] | undefined;
    layout?: Record<string, string>;
    data?: {
      x: Array<number>;
      y: Array<number>;
      z: Array<number>;
      type: PlotType;
      mode: PlotData['mode'];
    }[];
  };
};
export interface ResultsType {
  io?: ResultIO[];
}
export type ResultNodeData = ElementsData & {
  resultData?: ResultIO["result"];
};
