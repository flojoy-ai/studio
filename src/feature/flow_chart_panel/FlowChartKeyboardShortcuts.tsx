import useKeyboardShortcut from "@src/hooks/useKeyboardShortcut";
import { useSave } from "@src/hooks/useSave";
import { useReactFlow } from "reactflow";

const FlowChartKeyboardShortcuts = () => {
  const { zoomIn, zoomOut } = useReactFlow();
  const save = useSave();

  useKeyboardShortcut("ctrl", "=", zoomIn);
  useKeyboardShortcut("ctrl", "-", zoomOut);
  useKeyboardShortcut("meta", "=", zoomIn);
  useKeyboardShortcut("meta", "-", zoomOut);

  useKeyboardShortcut("ctrl", "s", save);
  useKeyboardShortcut("meta", "s", save);

  return <div></div>;
};

export default FlowChartKeyboardShortcuts;
