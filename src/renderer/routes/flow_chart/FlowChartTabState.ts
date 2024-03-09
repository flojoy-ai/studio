import { useState } from "react";

export function useFlowChartTabState() {
  const [pythonString, setPythonString] = useState("...");
  const [nodeFilePath, setNodeFilePath] = useState("...");
  const [blockFullPath, setBlockFullPath] = useState("");

  return {
    nodeFilePath,
    pythonString,
    setNodeFilePath,
    setPythonString,
    blockFullPath,
    setBlockFullPath,
  };
}
