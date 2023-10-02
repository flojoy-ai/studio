import useKeyboardShortcut from "@src/hooks/useKeyboardShortcut";
import { useSave } from "@src/hooks/useSave";
import { useLoadApp } from "@src/hooks/useLoadApp";
import { useReactFlow } from "reactflow";

const FlowChartKeyboardShortcuts = () => {
  const { zoomIn, zoomOut } = useReactFlow();
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

  return <div></div>;
};

export default FlowChartKeyboardShortcuts;
