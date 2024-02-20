import useWithPermission from "./useWithPermission";
import { useTestSequencerState } from "./useTestSequencerState";
import { stringifyTestSet } from "../routes/test_sequencer_panel/utils/TestSetUtils";

export const useTestSetSave = () => {
  const { withPermissionCheck } = useWithPermission();
  const { elems, setUnsaved } = useTestSequencerState();

  const handleSave = async () => {
    try {
      if ("api" in window) {
        const { filePath, canceled } = await window.api.saveFileAs(
          "test_set",
          stringifyTestSet(elems),
          ["tjoy"],
        );
        if (canceled) {
          throw new Error("Test set save was cancelled");
        }
        setUnsaved(false);
        return filePath;
      }
    } catch {
      // exception just means user cancelled save
    }
  };

  return withPermissionCheck(handleSave);
};
