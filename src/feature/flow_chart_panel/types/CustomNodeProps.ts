import type { Commands } from "../manifest/COMMANDS_MANIFEST";

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
      value: string;
    };
  };
  inputs?: Array<{ name: string; id: string; type:string }>
  selects?: any;
  selected?:boolean;
  docker?: Commands[0]['docker']
}

export interface CustomNodeProps {
  data: ElementsData;
}