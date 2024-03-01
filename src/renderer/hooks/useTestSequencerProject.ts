import useWithPermission from "./useWithPermission";
import { useTestSequencerState } from "./useTestSequencerState";
import { readJsonProject, stringifyProject, stringifyTestSet } from "../routes/test_sequencer_panel/utils/TestSetUtils";
import { TestSequenceElement, TestSequencerProject } from "../types/testSequencer";
import { toast } from "sonner";

async function saveProject(project: TestSequencerProject) {
  try {
    console.log("Saving project to disk");
    const sep = project.projectPath.endsWith("/") || project.projectPath.endsWith("\\") ? "" : "/";
    const path = project.projectPath + sep + project.name + ".tjoy";
    // Reset the status of all tests (TODO merge with other instance of this code)
    project.elems = [...project.elems].map((elem) => {
        return elem.type === "test"
          ? {
              ...elem,
              status: "pending",
              completionTime: undefined,
              isSavedToCloud: false,
            }
          : { ...elem };
      });
    if ("api" in window) {
      await window.api.saveToFile(
        path,
        stringifyProject(project)
      );
    }
  } catch (e) {
    toast.error(`Error saving project to disk ${e}`);
  }
}

export const useSaveProject = () => {
  const { withPermissionCheck } = useWithPermission();
  const { project, setUnsaved } = useTestSequencerState();
  const handleSave = async () => {
    if (!project) {
      toast.error("Not project to save. Please create a project first.");
      return;
    }
    await saveProject(project);
    setUnsaved(false);
  };

  return withPermissionCheck(handleSave);
};


export const useCreateProject = () => {
  const { setProject, setUnsaved } = useTestSequencerState();
  const { withPermissionCheck } = useWithPermission();
  const handleCreate = async (projectToCreate: TestSequencerProject) => {
    const project = projectToCreate;
    project.elems.forEach((elem) => {
      if (elem.type === "test") {
        // TODO: Verif that each element is already in the project folder (if not, copy it)
        const elements: any = JSON.parse(JSON.stringify(project.elems));
        elements.forEach((elem) => { 
          if (elem.type === "test") elem.path = elem.path.replace(project.projectPath, ""); 
        });
        project.elems = elements as TestSequenceElement[];
      }
    });
    // Create the actial project on disk
    await saveProject(project);
    setProject(project);
    setUnsaved(false);
  };
  return withPermissionCheck(handleCreate);
}

export const useImportProject = () => {
  const { withPermissionCheck } = useWithPermission();
  const { isUnsaved, setUnsaved, setProject, setElems } = useTestSequencerState();
  const handleImport = async () => {
    if (isUnsaved) {
      const shouldContinue = window.confirm("You have unsaved changes. Do you want to continue?");
      if (!shouldContinue) return;
    }
    window.api
      .openFilePicker(["tjoy"])
      .then((result) => {
        if (!result) return;
        const { fileContent } = result;
        const project = JSON.parse(fileContent);
        setProject(project);
        setElems(project.elems); // TODO Shoud be handle in setProject
        setUnsaved(false);  // TODO should be handle in setProject
        // TODO: handle deps
      })
      .catch((errors) => {
        console.error("Errors when trying to load file: ", errors);
      });
  };
  return withPermissionCheck(handleImport);
}
