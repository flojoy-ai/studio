import useWithPermission from "./useWithPermission";
import {
  useDisplayedSequenceState,
  useSequencerState,
} from "./useTestSequencerState";
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
import { toastResultPromise } from "@/renderer/utils/report-error";
import { Result, err, ok } from "neverthrow";
import { installTestProfile } from "@/renderer/lib/api";
import { useSequencerStore } from "@/renderer/stores/sequencer";
import { useShallow } from "zustand/react/shallow";

function usePrepareStateManager(): StateManager {
  const { elems, project } = useDisplayedSequenceState();
  const { addNewSequence, removeSequence, sequences } = useSequencerState();
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
  const manager = usePrepareStateManager();
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

export const useLoadTestProfile = () => {
  const manager = usePrepareStateManager();
  const { isAdmin } = useWithPermission();
  const setCommitHash = useSequencerStore(
    useShallow((state) => state.setCommitHash),
  );
  const handleImport = async (gitRepoUrlHttp: string) => {
    if (gitRepoUrlHttp === "") {
      return;
    }
    async function importSequences(): Promise<Result<void, Error>> {
      if (isAdmin()) {
        const shouldContinue = window.confirm(
          "Do you want to load the sequences associated with test profile?",
        );
        if (!shouldContinue) {
          return err(Error("User cancelled loading test profile"));
        }
      }
      const res = await installTestProfile(gitRepoUrlHttp);
      if (res.isErr()) {
        return err(Error(`Failed to load test profile: ${res.error}`));
      }
      setCommitHash(res.value.hash);
      const result = await window.api.openAllFilesInFolder(
        res.value.profile_root,
        ["tjoy"],
      );
      if (result === undefined) {
        return err(
          Error(`Failed to find the directory ${res.value.profile_root}`),
        );
      }
      if (!result || result.length === 0) {
        return err(Error("No .tjoy file found in the selected directory"));
      }
      await Promise.all(
        result.map(async (res, idx) => {
          const { filePath, fileContent } = res;
          const result = await importSequence(
            filePath,
            fileContent,
            manager,
            idx !== 0,
          );
          if (result.isErr()) return err(result.error);
        }),
      );
      return ok(undefined);
    }
    toastResultPromise(importSequences(), {
      loading: `Importing Test Profile...`,
      success: () => `Test Profile imported`,
      error: (e) => `${e}`,
    });
  };

  return handleImport;
};

export const useCloseSequence = () => {
  const { isUnsaved } = useDisplayedSequenceState();
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
