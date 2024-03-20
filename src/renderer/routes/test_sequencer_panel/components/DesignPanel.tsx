import { useModalStore } from "@/renderer/stores/modal";
import LockableButton from "./lockable/LockedButtons";
import {
  useImportProject,
  useSaveProject,
  useCloseProject,
} from "@/renderer/hooks/useTestSequencerProject";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import _ from "lodash";
import { Button } from "@/renderer/components/ui/button";
import { PauseIcon } from "lucide-react";
import { ControlButton } from "./ControlButton";


export function DesignPanel() {
  const { setIsImportTestModalOpen, setIsCreateProjectModalOpen } = useModalStore();
  const { project } = useTestSequencerState();

  const projectImport = useImportProject();
  const saveProject = useSaveProject();
  const closeProject = useCloseProject();

  return (
    <div className="py-4">
      <div className="flex flex-col">
        <h2 className="text-lg font-bold text-accent1 ">
          Import Test 
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
        {project === null && (
          <LockableButton
            className="mt-4 w-full"
            variant="outline"
            onClick={projectImport}
          >
            Import Project
          </LockableButton>
        )}
        {project !== null && (
          <LockableButton
            className="mt-4 w-full"
            variant="outline"
            onClick={() => {
              saveProject();
            }}
          >
            Save Project
          </LockableButton>
        )}
        {project !== null && (
          <LockableButton
            className="mt-4 w-full"
            variant="outline"
            onClick={() => {
              closeProject();
            }}
          >
            Close Project
          </LockableButton>
        )}
        {project === null && (
          <LockableButton
            className="mt-4 w-full"
            variant="outline"
            onClick={() => {
              setIsCreateProjectModalOpen(true);
            }}
          >
            New Project
          </LockableButton>
        )}

        <ControlButton />

      </div>
    </div>
  );
}
