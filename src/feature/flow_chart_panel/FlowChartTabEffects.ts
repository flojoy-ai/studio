import { useEffect } from "react";
import { Node } from "reactflow";
import { ResultsType } from "../results_panel/types/ResultsType";
import { FlowChartTabStateReturnType } from "./FlowChartTabState";
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
  results: ResultsType | null;
  clickedElement: Node | undefined;
}) {
  useEffect(() => {
    console.log("11");
    if (results && results.io) {
      const runResults = results.io; // JSON.parse(results.io);
      const filteredResult = runResults.filter(
        (node) => node.id === clickedElement?.id
      )[0];

      setNd(filteredResult === undefined ? null : filteredResult);
    }
  }, [results, clickedElement]);

  useEffect(() => {
    console.log("12");
    if (clickedElement?.data?.label && clickedElement?.data?.type) {
      setNodeLabel(clickedElement.data.func);
      setNodeType(clickedElement.data.type);
    }
  }, [clickedElement]);

  useEffect(() => {
    console.log("13");
    setPythonString(
      nodeLabel === defaultPythonFnLabel || nodeType === defaultPythonFnType
        ? "..."
        : PYTHON_FUNCTIONS[nodeLabel + ".py"]
    );
  }, [nodeLabel, nodeType, clickedElement]);
}
