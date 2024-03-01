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
  const { elems, setUnsaved, setProject } = useTestSequencerState();
  const handleCreate = async (projectToCreate: TestSequencerProject) => {
    try {
      console.log("Creating project", projectToCreate);
      const project = projectToCreate;
      // Copy the current tree and change the to use the root

      // Create the actial project on disk
      try {

        console.log("Saving project to disk");
        const sep = project.tjoy_file_path.endsWith("/") || project.tjoy_file_path.endsWith("\\") ? "" : "/";
        const path = project.tjoy_file_path + sep + project.name + ".tjoy";

        if ("api" in window) {
          const result = await window.api.saveToFile(
            path,
            stringifyTestSet(elems)
          );
        }
      } catch (e) {
        console.log("Error saving project to disk", e);
      }
      setProject(project);
      setUnsaved(false);
    } catch (e) {
      console.log("Error creating project", e);
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
