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
      error: (e) => `${e}`,
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
      error: (e) => `${e}`,
    });
  };

  return withPermissionCheck(handle);
}

export const useImportSequences = () => {
  // TODO - When technicien in user, open from cloud project list
  const manager = usePrepareStateManager(true);
  const handleImport = async () => {
    const result = await window.api.openFilesPicker(
      ["tjoy"],
      "Select your .tjoy file",
    );
    if (!result || result.length === 0) return;
    const importSequences = async () => {
      await Promise.all(
        result.map(async (res, idx) => {
          const { filePath, fileContent } = res;
          await importSequence(filePath, fileContent, manager, true, idx !== 0);
        }),
      );
    };
    const s = result.length > 1 ? "s" : "";
    toast.promise(importSequences, {
      loading: `Importing${s} sequence...`,
      success: () => `Sequence${s} imported`,
      error: (e) => `${e}`,
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
