import { OnLoadParams, Elements } from "react-flow-renderer";
import { NOISY_SINE } from "../data/RECIPES.js";
import { useAtom } from "jotai";
import { atomWithImmer } from "jotai/immer";

const initialElements: Elements = NOISY_SINE.elements;

const rfInstanceAtom = atomWithImmer<OnLoadParams | undefined>(undefined);
const elementsAtom = atomWithImmer<Elements>(initialElements);

export function useFlowChartState() {
  const [rfInstance, setRfInstance] = useAtom(rfInstanceAtom);
  const [elements, setElements] = useAtom(elementsAtom);

  const updateCtrlInputDataForNode = (nodeId: string, inputId: string, inputData: any) => {
    setElements((elements) => {
      const node = elements.find((e) => e.id === nodeId);
      if (node) {
          node.data.ctrls = node.data.ctrls || {};
          node.data.ctrls[inputId] = inputData;
      }
    });
  };

  return {
    rfInstance,
    setRfInstance,
    elements,
    setElements,
    updateCtrlInputDataForNode
  };
}
