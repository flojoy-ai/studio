import { useEffect } from "react";
import { Node } from "reactflow";
import { useFlowChartState } from "../../hooks/useFlowChartState";
import { saveFlowChartToLocalStorage } from "../../services/FlowChartServices";
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
  results: ResultsType;
  clickedElement: Node | undefined;
}) {
  const { rfInstance } = useFlowChartState();

  useEffect(() => {
    console.log("11");
    if (results && "io" in results) {
      const runResults = results.io!; // JSON.parse(results.io);
      const filteredResult = runResults.filter(
        (node: any) => node.id === clickedElement?.id
      )[0];

      setNd(filteredResult === undefined ? null : filteredResult);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results, clickedElement]);

  useEffect(() => {
    console.log("12");
    if (clickedElement?.data?.label && clickedElement?.data?.type) {
      setNodeLabel(clickedElement.data.func);
      setNodeType(clickedElement.data.type);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedElement]);

  useEffect(() => {
    console.log("13");
    setPythonString(
      nodeLabel === defaultPythonFnLabel || nodeType === defaultPythonFnType
        ? "..."
        : PYTHON_FUNCTIONS[nodeLabel + ".py"]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeLabel, nodeType, clickedElement]);

  // useEffect(() => {
  //   saveFlowChartToLocalStorage(rfInstance);
  // }, [rfInstance]);
}
