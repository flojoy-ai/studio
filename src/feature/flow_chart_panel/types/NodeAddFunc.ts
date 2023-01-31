export type ParamTypes = {
  [x: string]: {
    type: string;
    options?: string[];
    default: number | string;
  };
};

export type NodeOnAddFunc = (props: {
  key: string;
  type: string;
  params: ParamTypes | undefined;
  inputs?: Array<{ name: string, id: string }> | undefined;
}) => void;