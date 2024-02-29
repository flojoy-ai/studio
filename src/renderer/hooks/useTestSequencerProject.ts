import useWithPermission from "./useWithPermission";
import { useTestSequencerState } from "./useTestSequencerState";
import { stringifyTestSet } from "../routes/test_sequencer_panel/utils/TestSetUtils";
import { TestSequencerProject } from "../types/testSequencer";
import { saveFile } from "@/api/fileSave";



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
  const { elems, setUnsaved, setProject } = useTestSequencerState();
  const handleCreate = async (projectToCreate: TestSequencerProject) => {
    try {
      const project = projectToCreate;
      // Copy the current tree and change the to use the root


      // Create the actial project on disk
      try {
        saveFile(
          project.tjoy_file_path + project.name + ".tjoy",
          stringifyTestSet(elems),
          ["tjoy"]
        )
      } catch {
        // exception just means user cancelled save
      }
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
