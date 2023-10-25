import useKeyboardShortcut from "@src/hooks/useKeyboardShortcut";
import { useSave } from "@src/hooks/useSave";
import { useLoadApp } from "@src/hooks/useLoadApp";
import { useReactFlow } from "reactflow";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";

const FlowChartKeyboardShortcuts = () => {
  const { zoomIn, zoomOut } = useReactFlow();
  const { undo, redo } = useFlowChartGraph();
  const save = useSave();
  const openFileSelector = useLoadApp();

  useKeyboardShortcut("ctrl", "=", zoomIn);
  useKeyboardShortcut("meta", "=", zoomIn);

  useKeyboardShortcut("ctrl", "-", zoomOut);
  useKeyboardShortcut("meta", "-", zoomOut);

  useKeyboardShortcut("ctrl", "s", save);
  useKeyboardShortcut("meta", "s", save);

  useKeyboardShortcut("ctrl", "o", openFileSelector);
  useKeyboardShortcut("meta", "o", openFileSelector);

  useKeyboardShortcut("ctrl", "z", undo);
  useKeyboardShortcut("meta", "z", undo);

  useKeyboardShortcut("ctrl", "y", redo);
  useKeyboardShortcut("meta", "y", redo);

  return <div></div>;
};

export default FlowChartKeyboardShortcuts;
