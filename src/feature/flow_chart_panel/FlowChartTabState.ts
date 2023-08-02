import { useState } from "react";
import { useWindowSize } from "react-use";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
const defaultPythonFnLabel = "PYTHON FUNCTION";
const defaultPythonFnType = "PYTHON FUNCTION TYPE";

export function useFlowChartTabState() {
  const { width } = useWindowSize();
  const [modalIsOpen, setIsModalOpen] = useState(false);
  const [nodeLabel, setNodeLabel] = useState(defaultPythonFnLabel);
  const [nodeType, setNodeType] = useState(defaultPythonFnType);
  const [pythonString, setPythonString] = useState("...");
  const [nodeFilePath, setNodeFilePath] = useState("...");
  const { setIsExpandMode } = useFlowChartState();

  const closeModal = () => {
    setIsExpandMode(false);
  };

  return {
    windowWidth: width,
    modalIsOpen,
    setIsModalOpen,
    closeModal,
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
