import useWithPermission from "./useWithPermission";
import { useTestSequencerState } from "./useTestSequencerState";
import { TestSequencerProject } from "@/renderer/types/test-sequencer";
import { toast } from "sonner";
import {
  createProject,
  saveProject,
  importProject,
  StateManager,
  closeProject,
} from "@/renderer/routes/test_sequencer_panel/utils/TestSequenceProjectHandler";

function usePrepareStateManager(
  withoutPermission: boolean = false,
): StateManager {
  const { elems, project, addNewSequence, removeSequence } =
    useTestSequencerState();
  if (withoutPermission) {
    return {
      elems,
      addNewSequence,
      removeSequence,
      project,
    };
  }
  return { elems, project, addNewSequence, removeSequence };
}

export function useSaveProject() {
  const { withPermissionCheck } = useWithPermission();
  const manager = usePrepareStateManager();
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
  const manager = usePrepareStateManager();
  const handle = async (
    project: TestSequencerProject,
    setModalOpen: (val: boolean) => void | null,
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
  const manager = usePrepareStateManager(true);
  const handleImport = async () => {
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
  const manager = usePrepareStateManager();
  const handle = async () => {
    if (isUnsaved) {
      const shouldContinue = window.confirm(
        "You have unsaved changes. Do you want to continue?",
      );
      if (!shouldContinue) return;
    }
    await closeProject(manager);
  };

  return handle;
};
