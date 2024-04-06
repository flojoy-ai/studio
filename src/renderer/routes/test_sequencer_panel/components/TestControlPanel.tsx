import { useContext, useState } from "react";
import LockableButton from "./lockable/LockedButtons";
import { TSWebSocketContext } from "@/renderer/context/testSequencerWS.context";
import _ from "lodash";
import {
  testSequenceRunRequest,
  testSequenceStopRequest,
} from "@/renderer/routes/test_sequencer_panel/models/models";
import { TestSequenceElement } from "@/renderer/types/test-sequencer";
import {
  useImportProject,
  useSaveProject,
  useCloseProject,
} from "@/renderer/hooks/useTestSequencerProject";
import { ImportTestModal } from "./ImportTestModal";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import { TestSequencerProjectModal } from "./TestSequencerProjectModal";

export const TestControlPanel = () => {
  const { setElems, tree, setIsLocked, backendState, project } =
    useTestSequencerState();
  const { tSSendJsonMessage } = useContext(TSWebSocketContext);
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
  const projectImport = useImportProject();
  const saveProject = useSaveProject();
  const closeProject = useCloseProject();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const handleClickImportTest = () => {
    setIsImportModalOpen(true);
  };
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  return (
    <div className="mt-5 rounded-xl border border-gray-300 p-4 py-4 dark:border-gray-800">
      <ImportTestModal
        isModalOpen={isImportModalOpen}
        handleModalOpen={setIsImportModalOpen}
      />
      <TestSequencerProjectModal
        isProjectModalOpen={isProjectModalOpen}
        handleProjectModalOpen={setIsProjectModalOpen}
      />
      <div className="flex flex-col">
        <h2 className="mb-2 pt-3 text-center text-lg font-bold text-accent1 ">
          Control Panel
        </h2>
        <LockableButton
          className="mt-4 w-full"
          variant="outline"
          onClick={handleClickImportTest}
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
              setIsProjectModalOpen(true);
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
};
