import useWithPermission from "./useWithPermission";
import { useTestSequencerState } from "./useTestSequencerState";
import { TestSequencerProject } from "../types/testSequencer";
import { toast } from "sonner";
import { Dispatch, SetStateAction } from "react";
import { createProject, saveProject, importProject } from "@/renderer/utils/TestSequenceProjectHandler";


export function useSaveProject() {
  const { withPermissionCheck } = useWithPermission();
  const handle = async () => {
    toast.promise(saveProject(), {
    loading: "Saving project...",
    success: (result) => {
      if (result.ok) {
        return "Project saved";
      } else {
        return `Error saving project: ${result.error}`;
      }
    },
    error: (e) => `Error saving project: ${e}`,
    });
  };

  return withPermissionCheck(handle);
}

export function useCreateProject() {
  const { withPermissionCheck } = useWithPermission();
  const handle = async (project: TestSequencerProject, setModalOpen: Dispatch<SetStateAction<boolean>> | null) => {
    toast.promise(createProject(project), {
    loading: "Creating project...",
    success: (result) => {
      if (result.ok) {
        if (setModalOpen) {
          setModalOpen(false);
        }
        return "Project created";
      } else {
        return `Error creating project: ${result.error}`;
      }
    },
    error: (e) => `Error creating project: ${e}`,
    });
  };

  return withPermissionCheck(handle);
}


export const useImportProject = () => {
  const { isUnsaved } = useTestSequencerState();
  const handleImport = async () => {
    if (isUnsaved) {
      const shouldContinue = window.confirm("You have unsaved changes. Do you want to continue?");
      if (!shouldContinue) return;
    }
    window.api
      .openFilePicker(["tjoy"])
      .then((result) => {
        if (!result) return;
        const { filePath, fileContent } = result;
        toast.promise(importProject(filePath, fileContent), {
          loading: "Importing project...",
          success: (result) => {
            if (result.ok) {
              return "Project imported";
            } else {
              return `Error importing project: ${result.error}`;
            }
          },
          error: (e) => `Error importing project: ${e}`,
        });
      })
  };
  return handleImport;
}
