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
  inputs?: Array<{ name: string; id: string; type: string }> | undefined;
  uiComponentId?: string;
  pip_dependencies?: Array<{
    name: string;
    v?: string | number;
  }>;
}) => void;
