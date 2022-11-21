export type ElementsData = {
  label: string;
  func: string;
  type: string;
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