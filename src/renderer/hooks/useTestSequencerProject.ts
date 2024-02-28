import useWithPermission from "./useWithPermission";
import { useTestSequencerState } from "./useTestSequencerState";
import { stringifyTestSet } from "../routes/test_sequencer_panel/utils/TestSetUtils";
import { TestSequencerProject } from "../types/testSequencer";



export const useProjectSave = () => {
  const { withPermissionCheck } = useWithPermission();
  const { elems, setUnsaved, project } = useTestSequencerState();

  const handleSave = async () => {
    try {

    } catch {

    }
  };

  return withPermissionCheck(handleSave);
};


export const useCreateProject = () => {
  const { withPermissionCheck } = useWithPermission();
  const { tree, setUnsaved, setProject } = useTestSequencerState();
  const handleCreate = async (name: string, description: string, tjoy_file_path: string) => {
    try {
      const project: TestSequencerProject = {
        name: name,
        description: description,
        root: tree,
        tjoy_file_path: tjoy_file_path,
        interpreter_path: null,
        requirement_file_path: null,
      };
      // Create the actial project on disk

      // Save state
      setProject(project);
      setUnsaved(false);
    } catch {
      
    }
  };
  return withPermissionCheck(handleCreate);
}


export const useImportProject = () => {
  const { withPermissionCheck } = useWithPermission();
  const { elems, isUnsaved, setProject } = useTestSequencerState();
  const handleImport = async () => {
    try {
        
    } catch {

    }
  };
  return withPermissionCheck(handleImport);
}
