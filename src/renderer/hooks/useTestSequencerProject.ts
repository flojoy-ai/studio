import useWithPermission from "./useWithPermission";
import { useSequencerTestState, useSequencerState } from "./useTestSequencerState";
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
import { toastResultPromise } from "../utils/report-error";

function usePrepareStateManager(
  withoutPermission: boolean = false,
): StateManager {
  const { elems, project } = useSequencerTestState();
  const { addNewSequence, removeSequence, sequences } = useSequencerState();
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
    toastResultPromise(saveSequence(manager), {
      loading: "Saving sequence...",
      success: () => "Sequence saved",
      error: (e) => `${e}`,
    });
  };

  return withPermissionCheck(handle);
}

export function useSaveAllSequences() {
  const { withPermissionCheck } = useWithPermission();
  const manager = usePrepareStateManager();
  const handle = async () => {
    toastResultPromise(saveSequences(manager), {
      loading: "Saving sequences...",
      success: () => "Sequences saved",
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
    toastResultPromise(createSequence(project, manager), {
      loading: "Creating sequence...",
      success: () => {
        setModalOpen(false);
        return "Sequence created";
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
          const result = await importSequence(
            filePath,
            fileContent,
            manager,
            idx !== 0,
          );
          if (result.isErr()) throw result.error;
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
  const { isUnsaved } = useSequencerTestState();
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
