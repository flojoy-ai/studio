import { ResultsType } from "@src/feature/results_panel/types/ResultsType";
import { WritableDraft } from "immer/dist/internal";
import React from "react";
import { Node, ReactFlowJsonObject } from "reactflow";

export interface FlowChartProps {
  results: ResultsType;
  theme: "light" | "dark";
  rfInstance: ReactFlowJsonObject;
  setRfInstance: (
    update?:
      | ReactFlowJsonObject<any, any>
      | ((
          draft: WritableDraft<ReactFlowJsonObject<any, any>> | undefined
        ) => void)
      | undefined
  ) => void;

  clickedElement: Node | undefined;
  setClickedElement: React.Dispatch<React.SetStateAction<Node | undefined>>;
}
