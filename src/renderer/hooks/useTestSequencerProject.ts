import useWithPermission from "./useWithPermission";
import { useTestSequencerState } from "./useTestSequencerState";
import { TestSequencerProject } from "../types/testSequencer";
import { toast } from "sonner";
import { Dispatch, SetStateAction } from "react";
import {
  createProject,
  saveProject,
  importProject,
  StateManager,
  closeProject,
} from "@/renderer/utils/TestSequenceProjectHandler";

function getPrepareStateManager(
  withoutPermission: boolean = false,
): StateManager {
  const { elems, setElems, project, setProject, setUnsaved } =
    useTestSequencerState();
  if (withoutPermission) {
    // @ts-ignore
    return {
      setElems: setElems.withException,
      setProject,
      setUnsaved,
      elem: elems,
      project,
    };
  }
  // @ts-ignore
  return { setElems, setProject, setUnsaved, elem: elems, project };
}

export function useSaveProject() {
  const { withPermissionCheck } = useWithPermission();
  const manager = getPrepareStateManager();
  const handle = async () => {
    toast.promise(saveProject(manager, true), {
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
  const manager = getPrepareStateManager();
  const handle = async (
    project: TestSequencerProject,
    setModalOpen: Dispatch<SetStateAction<boolean>> | null,
  ) => {
    toast.promise(createProject(project, manager, true), {
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
  const manager = getPrepareStateManager(true);
  const handleImport = async () => {
    if (isUnsaved) {
      const shouldContinue = window.confirm(
        "You have unsaved changes. Do you want to continue?",
      );
      if (!shouldContinue) return;
    }
    window.api.openFilePicker(["tjoy"]).then((result) => {
      if (!result) return;
      const { filePath, fileContent } = result;
      toast.promise(importProject(filePath, fileContent, manager, true), {
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
    });
  };
  return handleImport;
};

export const useCloseProject = () => {
  const { isUnsaved } = useTestSequencerState();
  const manager = getPrepareStateManager();
  const handle = async () => {
    if (isUnsaved) {
      const shouldContinue = window.confirm(
        "You have unsaved changes. Do you want to continue?",
      );
      if (!shouldContinue) return;
    }
    await closeProject(manager, false);
  };

  return handle;
};
