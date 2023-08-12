import { useState } from "react";
import { useWindowSize } from "react-use";
const defaultPythonFnLabel = "PYTHON FUNCTION";
const defaultPythonFnType = "PYTHON FUNCTION TYPE";

export function useFlowChartTabState() {
  const { width } = useWindowSize();
  const [nodeLabel, setNodeLabel] = useState(defaultPythonFnLabel);
  const [nodeType, setNodeType] = useState(defaultPythonFnType);
  const [pythonString, setPythonString] = useState("...");
  const [nodeFilePath, setNodeFilePath] = useState("...");

  return {
    windowWidth: width,
    nodeLabel,
    nodeType,
    nodeFilePath,
    pythonString,
    setNodeLabel,
    setNodeType,
    setNodeFilePath,
    setPythonString,
  };
}
