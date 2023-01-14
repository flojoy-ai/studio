import { useEffect } from "react";
import { Node } from "reactflow";
import { useFlowChartState } from "../../hooks/useFlowChartState";
import { saveFlowChartToLocalStorage } from "../../services/FlowChartServices";
import { ResultsType } from "../results_panel/types/ResultsType";
import {
  FlowChartTabStateReturnType,
} from "./FlowChartTabState";
import PYTHON_FUNCTIONS from "./manifest/pythonFunctions.json";

export function useFlowChartTabEffects({
  results,
  clickedElement,
  setNodeLabel,
  setNodeType,
  setPythonString,
  setNd,
  defaultPythonFnLabel,
  defaultPythonFnType,
  nodeLabel,
  nodeType,
}: FlowChartTabStateReturnType & {
  results: ResultsType;
  clickedElement: Node | undefined;
}) {
  const { rfInstance } = useFlowChartState();

  useEffect(() => {
    if (results && "io" in results) {
      const runResults = results.io!; // JSON.parse(results.io);
      const filteredResult = runResults.filter(
        (node: any) => node.id === clickedElement?.id
      )[0];

      setNd(filteredResult === undefined ? {} : filteredResult);
    }
  }, [results, clickedElement]);

  useEffect(() => {
    if (clickedElement) {
      if ("data" in clickedElement) {
        if ("label" in clickedElement.data && "type" in clickedElement.data) {
          if (
            clickedElement.data.label !== undefined &&
            clickedElement.data.type !== undefined
          ) {
            setNodeLabel(clickedElement.data.func);
            setNodeType(clickedElement.data.type);
          }
        }
      }
    }
  }, [clickedElement]);

  useEffect(() => {
    setPythonString(
      nodeLabel === defaultPythonFnLabel || nodeType === defaultPythonFnType
        ? "..."
        : PYTHON_FUNCTIONS[nodeType][nodeLabel + ".py"]
    );
  }, [nodeLabel, nodeType, clickedElement]);
  useEffect(() => {
    saveFlowChartToLocalStorage(rfInstance);
  }, [rfInstance]);
}
