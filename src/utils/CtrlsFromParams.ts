import { ElementsData } from "@src/types";
import { Leaf as NodeElement } from "@src/utils/ManifestLoader";

export const ctrlsFromParams = (
  params: NodeElement["parameters"] | undefined,
  funcName: string,
): ElementsData["ctrls"] => {
  if (!params) {
    return {};
  }

  return Object.fromEntries(Object.entries(params).map(([paramName, param]) => (
    [paramName, {
      ...param,
      functionName: funcName,
      param: paramName,
      value: param.default ?? ""
    }]
  )));
}

