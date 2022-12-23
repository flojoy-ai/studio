export interface CtrlOptionValue {
  id: string;
  functionName: string;
  param: string;
  nodeId: string;
  inputId: string;
}
export interface ControlOptions {
  label: string;
  value: CtrlOptionValue | string;
}