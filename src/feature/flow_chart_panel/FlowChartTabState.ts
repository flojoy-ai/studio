import { useState } from "react";
import { useWindowSize } from "react-use";
import { ResultIO } from "../results_panel/types/ResultsType";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
const defaultPythonFnLabel = "PYTHON FUNCTION";
const defaultPythonFnType = "PYTHON FUNCTION TYPE";

export function useFlowChartTabState() {
  const { width } = useWindowSize();
  const [modalIsOpen, setIsModalOpen] = useState(false);
  const [nd, setNd] = useState<ResultIO | null>(null);
  const [nodeLabel, setNodeLabel] = useState(defaultPythonFnLabel);
  const [nodeType, setNodeType] = useState(defaultPythonFnType);
  const [pythonString, setPythonString] = useState("...");
  const [nodeFilePath, setNodeFilePath] = useState("...");
  const { setIsExpandMode } = useFlowChartState();
  const [selectAllNodes, isSelectAllNodes] = useState(false);

  const closeModal = () => {
    setIsExpandMode(false);
  };

  return {
    windowWidth: width,
    modalIsOpen,
    setIsModalOpen,
    closeModal,
    nd,
    setNd,
    nodeLabel,
    nodeType,
    nodeFilePath,
    pythonString,
    setNodeLabel,
    setNodeType,
    setNodeFilePath,
    setPythonString,
    defaultPythonFnLabel,
    defaultPythonFnType,
    selectAllNodes,
    isSelectAllNodes,
  };
}

export type FlowChartTabStateReturnType = ReturnType<
  typeof useFlowChartTabState
>;
