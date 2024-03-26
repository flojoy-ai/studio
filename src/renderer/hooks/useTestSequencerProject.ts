import useWithPermission from "./useWithPermission";
import { useTestSequencerState } from "./useTestSequencerState";
import { TestSequencerProject } from "@/renderer/types/test-sequencer";
import { toast } from "sonner";
import {
  createSequence,
  saveSequence as saveSequence,
  importSequence,
  StateManager,
  closeSequence,
  saveSequences,
} from "@/renderer/routes/test_sequencer_panel/utils/SequenceHandler";

function usePrepareStateManager(
  withoutPermission: boolean = false,
): StateManager {
  const { elems, project, addNewSequence, removeSequence, sequences } =
    useTestSequencerState();
  if (withoutPermission) {
    return {
      elems,
      addNewSequence,
      removeSequence,
      project,
      sequences,
    };
  }
  return { elems, project, addNewSequence, removeSequence, sequences };
}

export function useSaveSequence() {
  const { withPermissionCheck } = useWithPermission();
  const manager = usePrepareStateManager();
  const handle = async () => {
    toast.promise(saveSequence(manager, true), {
      loading: "Saving sequence...",
      success: (result) => {
        if (result.ok) {
          return "Sequence saved";
        } else {
          return `Error saving sequence: ${result.error}`;
        }
      },
      error: (e) => `Error saving sequence: ${e}`,
    });
  };

  return withPermissionCheck(handle);
}

export function useSaveAllSequences() {
  const { withPermissionCheck } = useWithPermission();
  const manager = usePrepareStateManager();
  const handle = async () => {
    toast.promise(saveSequences(manager, true), {
      loading: "Saving sequences...",
      success: (result) => {
        if (result.ok) {
          return "Sequences saved";
        } else {
          return `Error saving sequences: ${result.error}`;
        }
      },
      error: (e) => `${e}`,
    });
  };

  return withPermissionCheck(handle);
}

export function useCreateSequence() {
  const { withPermissionCheck } = useWithPermission();
  const manager = usePrepareStateManager();
  const handle = async (
    project: TestSequencerProject,
    setModalOpen: (val: boolean) => void | null,
  ) => {
    toast.promise(createSequence(project, manager, true), {
      loading: "Creating sequence...",
      success: (result) => {
        if (result.ok) {
          if (setModalOpen) {
            setModalOpen(false);
          }
          return "Sequence created";
        } else {
          return `Error creating sequence: ${result.error}`;
        }
      },
      error: (e) => `Error creating sequence: ${e}`,
    });
  };

  return withPermissionCheck(handle);
}

export const useImportSequence = () => {
  const manager = usePrepareStateManager(true);
  const handleImport = async () => {
    window.api.openFilePicker(["tjoy"]).then((result) => {
      if (!result) return;
      const { filePath, fileContent } = result;
      toast.promise(importSequence(filePath, fileContent, manager, true), {
        loading: "Importing sequence...",
        success: (result) => {
          if (result.ok) {
            return "Sequence imported";
          } else {
            return `Error importing sequence: ${result.error}`;
          }
        },
        error: (e) => `Error importing sequence: ${e}`,
      });
    });
  };
  return handleImport;
};

export const useCloseSequence = () => {
  const { isUnsaved } = useTestSequencerState();
  const manager = usePrepareStateManager();
  const handle = async () => {
    if (isUnsaved) {
      const shouldContinue = window.confirm(
        "You have unsaved changes. Do you want to continue?",
      );
      if (!shouldContinue) return;
    }
    await closeSequence(manager);
  };

  return handle;
};
