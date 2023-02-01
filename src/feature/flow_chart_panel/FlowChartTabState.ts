import { useState } from "react";
import { useWindowSize } from "react-use";

const defaultPythonFnLabel = "PYTHON FUNCTION";
const defaultPythonFnType = "PYTHON FUNCTION TYPE"
export function useFlowChartTabState() {
  const { width } = useWindowSize();
  const [modalIsOpen, setIsModalOpen] = useState(false);
  const [nd, setNd] = useState({});
  const [nodeLabel, setNodeLabel] = useState(defaultPythonFnLabel);
  const [nodeType, setNodeType] = useState(defaultPythonFnType);
  const [pythonString, setPythonString] = useState("...")

  const openModal = () => {
    setIsModalOpen(true);
  };

  const afterOpenModal = () => null;

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return {
    windowWidth: width,
    modalIsOpen,
    setIsModalOpen,
    openModal,
    afterOpenModal,
    closeModal,
    nd,
    setNd,
    nodeLabel,
    nodeType,
    setNodeLabel,
    setNodeType,
    setPythonString,
    pythonString,
    defaultPythonFnLabel,
    defaultPythonFnType
  };
}

export type FlowChartTabStateReturnType = ReturnType<typeof useFlowChartTabState>