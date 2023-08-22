// import { useReactFlow } from "reactflow";
// import useKeyboardShortcut from "@src/hooks/useKeyboardShortcut";

import useKeyboardShortcut from "@src/hooks/useKeyboardShortcut";
import { useSave } from "@src/hooks/useSave";

const FlowChartKeyboardShortcuts = () => {
  // const { zoomIn, zoomOut, fitView } = useReactFlow();
  // useKeyboardShortcut("ctrl", "=", zoomIn);
  // useKeyboardShortcut("ctrl", "-", zoomOut);
  // useKeyboardShortcut("ctrl", "1", fitView);
  //
  // useKeyboardShortcut("meta", "=", zoomIn);
  // useKeyboardShortcut("meta", "-", zoomOut);
  // useKeyboardShortcut("meta", "1", fitView);
  //
  const save = useSave();
  useKeyboardShortcut("ctrl", "s", save);

  return <div></div>;
};

export default FlowChartKeyboardShortcuts;
