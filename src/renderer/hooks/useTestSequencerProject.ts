import useWithPermission from "./useWithPermission";
import { useTestSequencerState } from "./useTestSequencerState";
import { stringifyTestSet } from "../routes/test_sequencer_panel/utils/TestSetUtils";



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
  const { elems, setUnsaved } = useTestSequencerState();
  const handleCreate = async () => {
    try {
        
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
