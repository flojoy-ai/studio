import manifests from "../../../data/manifests-latest.json";
type FunctionParametersType = {
  [key: string]: {
    [key: string]: {
      type: string;
      default: string | number;
      options?: string[];
    };
  };
};
export const FUNCTION_PARAMETERS: FunctionParametersType = manifests?.parameters ?? {};
