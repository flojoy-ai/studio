import { useState } from "react";
import { OnLoadParams, Elements } from "react-flow-renderer";
import {NOISY_SINE} from '../data/RECIPES.js'

const initialElements: Elements = NOISY_SINE.elements;


export function useFlowChartState() {
  const [rfInstance, setRfInstance] = useState<OnLoadParams>();
  const [elements, setElements] = useState<Elements>(initialElements);

//   const updateElementData = (nodeId: string, data: any) => {
//     setElements(elements => )
//   }

  return {
      rfInstance,
      setRfInstance,
      elements,
      setElements
  }
}