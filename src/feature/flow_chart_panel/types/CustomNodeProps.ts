export type ElementsData = {
  id: string;
  label: string;
  func: string;
  type: string;
  running?: boolean;
  failed?: boolean;
  ctrls: {
    [key: string]: {
      functionName: string;
      param: string;
      value: string | boolean | number;
    };
  };
  inputs?: Array<{ name: string; id: string; type: string }>;
  selects?: any;
  selected?: boolean;
  handleRemove?: (nodeId: string) => void;
};

export interface CustomNodeProps {
  data: ElementsData;
}
