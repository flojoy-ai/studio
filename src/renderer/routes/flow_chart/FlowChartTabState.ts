import { useState } from "react";
import { useWindowSize } from "react-use";

export function useFlowChartTabState() {
  const { width } = useWindowSize();
  const [pythonString, setPythonString] = useState("...");
  const [nodeFilePath, setNodeFilePath] = useState("...");
  const [blockFullPath, setBlockFullPath] = useState("");

  return {
    windowWidth: width,
    nodeFilePath,
    pythonString,
    setNodeFilePath,
    setPythonString,
    blockFullPath,
    setBlockFullPath,
  };
}
