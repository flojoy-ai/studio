import useKeyboardShortcut from "@/renderer/hooks/useKeyboardShortcut";
import { useSave } from "./components/control-bar/SaveButton";
import { useImportSequence } from "@/renderer/hooks/useTestSequencerProject";

const SequencerKeyboardShortcuts = () => {
  const save = useSave();
  const importSequence = useImportSequence();

  useKeyboardShortcut("ctrl", "s", save);
  useKeyboardShortcut("meta", "s", save);

  useKeyboardShortcut("ctrl", "o", importSequence);
  useKeyboardShortcut("meta", "o", importSequence);

  return <div></div>;
};

export default SequencerKeyboardShortcuts;
