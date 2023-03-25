import type {Commands} from '@src/feature/flow_chart_panel/manifest/COMMANDS_MANIFEST'
export type ParamTypes = {
  [x: string]: {
    type: string;
    options?: string[];
    default: number | string;
  };
};

export type NodeOnAddFunc = (props: {
  funcName: string;
  type: string;
  params: ParamTypes | undefined;
  inputs?: Array<{ name: string, id: string, type:string }> | undefined;
  uiComponentId?: string;
  dockerInfo?: Commands[0]['docker']
}) => void;