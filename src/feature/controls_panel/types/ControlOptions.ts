import { ResultIO } from "@src/feature/results_panel/types/ResultsType";
import type { PlotType, PlotData } from "plotly.js";
export interface CtrlOptionValue {
  id: string;
  functionName: string;
  param: string;
  nodeId: string;
  inputId: string;
  type?: PlotType | string;
  mode?: PlotData["mode"];
}
export interface ControlOptions {
  label: string;
  value: CtrlOptionValue | string;
  type?: PlotType;
  mode?: PlotData["mode"];
}
export interface PlotControlOption {
  id: string;
  type?: PlotData["type"];
  mode?: PlotData["mode"];
}
export interface PlotControlOptions {
  label: string;
  value: PlotControlOption;
}

export interface NodeInputOptions {
  label: string;
  value: any; // ResultIO['result']
}
