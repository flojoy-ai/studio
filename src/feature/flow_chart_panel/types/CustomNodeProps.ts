export type ElementsData = {
  id: string;
  label: string;
  func: string;
  type: string;
  running?: boolean;
  failed?:boolean;
  ctrls: {
    [key: string]: {
      functionName: string;
      param: string;
      value: number;
    };
  };
  inputs?: Array<{ name: string; id: string }>
  selects?: any;
}

export interface CustomNodeProps {
  data: ElementsData;
}