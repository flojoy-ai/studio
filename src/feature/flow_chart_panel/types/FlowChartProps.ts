import { ResultsType } from "@src/feature/results_panel/types/ResultsType";
import { Draft } from "immer";
import React from "react";
import { Node, ReactFlowJsonObject } from "reactflow";

export interface FlowChartProps {
  results: ResultsType;
  theme: "light" | "dark";
  rfInstance: ReactFlowJsonObject;
  setRfInstance: (
    update?:
      | ReactFlowJsonObject<any, any>
      | ((draft: Draft<ReactFlowJsonObject<any, any>> | undefined) => void)
      | undefined
  ) => void;

  clickedElement: Node | undefined;
  setClickedElement: React.Dispatch<React.SetStateAction<Node | undefined>>;
}
