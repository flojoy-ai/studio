import useKeyboardShortcut from "@/renderer/hooks/useKeyboardShortcut";
import { useSave } from "./components/control-bar/SaveButton";
import { useImportProject } from "@/renderer/hooks/useTestSequencerProject";

const SequencerKeyboardShortcuts = () => {
  const save = useSave();
  const importSequence = useImportProject();

  useKeyboardShortcut("ctrl", "s", save);
  useKeyboardShortcut("meta", "s", save);

  useKeyboardShortcut("ctrl", "o", importSequence);
  useKeyboardShortcut("meta", "o", importSequence);

  return <div></div>;
};

export default SequencerKeyboardShortcuts;
