import { useModalStore } from "@/renderer/stores/modal";
import LockableButton from "./lockable/LockedButtons";
import {
  useImportProject,
  useSaveProject,
  useCloseProject,
} from "@/renderer/hooks/useTestSequencerProject";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import _ from "lodash";
import { TestSequenceElement } from "@/renderer/types/test-sequencer";
import {
  testSequenceRunRequest,
  testSequenceStopRequest,
} from "@/renderer/routes/test_sequencer_panel/models/models";
import { TSWebSocketContext } from "@/renderer/context/testSequencerWS.context";
import { useContext } from "react";


export function ControlPanel() {
  const { setIsImportTestModalOpen, setIsCreateProjectModalOpen } = useModalStore();
  const { setElems, tree, setIsLocked, backendState, project } = useTestSequencerState();
  const { tSSendJsonMessage } = useContext(TSWebSocketContext);

  const projectImport = useImportProject();
  const saveProject = useSaveProject();
  const closeProject = useCloseProject();

  const resetStatus = () => {
    setElems.withException((elems: TestSequenceElement[]) => {
      const newElems: TestSequenceElement[] = [...elems].map((elem) => {
        return elem.type === "test"
          ? {
              ...elem,
              status: "pending",
              completionTime: undefined,
              isSavedToCloud: false,
            }
          : { ...elem };
      });
      return newElems;
    });
  };


  const handleClickRunTest = () => {
    console.log("Start test");
    setIsLocked(true);
    resetStatus();
    tSSendJsonMessage(testSequenceRunRequest(tree));
  };
  const handleClickStopTest = () => {
    console.log("Stop test");
    tSSendJsonMessage(testSequenceStopRequest(tree));
    setIsLocked(false);
  };


  return (
    <div className="mt-5 rounded-xl border border-gray-300 p-4 py-4 dark:border-gray-800">
      <div className="flex flex-col">
        <h2 className="mb-2 pt-3 text-center text-lg font-bold text-accent1 ">
          Control Panel
        </h2>
        <LockableButton
          className="mt-4 w-full"
          variant="outline"
          onClick={() => {
            setIsImportTestModalOpen(true);
          }}
        >
          Add Python Tests
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
        <LockableButton
          variant="dotted"
          className="mt-4 w-full gap-2"
          isLocked={_.isEmpty(tree)}
          isException={backendState === "test_set_start"}
          onClick={
            backendState === "test_set_start"
              ? handleClickStopTest
              : handleClickRunTest
          }
        >
          {backendState === "test_set_start"
            ? "Stop Test Sequence"
            : "Run Test Sequence"}
        </LockableButton>
      </div>
    </div>
  );
}
