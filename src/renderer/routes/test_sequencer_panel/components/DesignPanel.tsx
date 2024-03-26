import { useModalStore } from "@/renderer/stores/modal";
import LockableButton from "./lockable/LockedButtons";
import {
  useImportSequences,
  useSaveSequence,
  useCloseSequence,
} from "@/renderer/hooks/useTestSequencerProject";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import _ from "lodash";
import { ControlButton } from "./ControlButton";


export function DesignPanel() {
  const { setIsImportTestModalOpen, setIsCreateProjectModalOpen } = useModalStore();

  const projectImport = useImportSequences();

  return (
    <div className="py-4">
      <div className="flex flex-col">
        <h2 className="text-lg font-bold text-accent1 ">
          Import Tests & Sequences
        </h2>
        <LockableButton
          className="mt-4 w-full"
          variant="outline"
          onClick={() => {
            setIsImportTestModalOpen(true);
          }}
        >
          Add New Tests 
        </LockableButton>
        <LockableButton
          className="mt-4 w-full"
          variant="outline"
          onClick={() => {
            setIsCreateProjectModalOpen(true);
          }}
        >
          New Sequence
        </LockableButton>
        <LockableButton
          className="mt-4 w-full"
          variant="outline"
          onClick={projectImport}
        >
          Import Sequence
        </LockableButton>
        <ControlButton />

      </div>
    </div>
  );
}
