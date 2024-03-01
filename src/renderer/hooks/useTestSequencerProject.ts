import useWithPermission from "./useWithPermission";
import { useTestSequencerState } from "./useTestSequencerState";
import { readJsonProject, stringifyProject, stringifyTestSet } from "../routes/test_sequencer_panel/utils/TestSetUtils";
import { TestSequenceElement, TestSequencerProject } from "../types/testSequencer";
import { toast } from "sonner";

async function saveProject(project: TestSequencerProject) {
  try {
    const sep = project.projectPath.endsWith("/") || project.projectPath.endsWith("\\") ? "" : "/";
    const path = project.projectPath + sep + project.name + ".tjoy";
    const elements = [...project.elems].map((elem) => {
      return elem.type === "test"
        ? {
            ...elem,
            status: "pending",
            completionTime: undefined,
            isSavedToCloud: false,
          }
        : { ...elem };
    });
    project = {
      ...project,
      // @ts-ignore LSP think this is wrong because of the use of .type == "test"
      elems : elements,
      projectPath: project.projectPath + sep,
    }
    console.log("Saving project to disk");
    if ("api" in window) {
      await window.api.saveToFile(
        path,
        stringifyProject(project)
      );
    }
  } catch (e) {
    toast.error(`Error saving project to disk ${e}`);
    console.log(`Error saving project to disk ${e}`);
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
    // TODO Handle stuff that are in other directories
    const elements = [...projectToCreate.elems].map((elem) => {
      return elem.type === "test"
        ? {
            ...elem,
            path: elem.path.replace(project.projectPath, "")
          }
        : { ...elem };
    });
    const project = { ...projectToCreate, elems: elements };
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
