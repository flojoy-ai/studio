import { useContext, useState } from "react";
import { DataTable } from "./data-table/DataTable";
import { SummaryTable } from "./SummaryTable";
import { CloudPanel } from "./CloudPanel";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import {
  testSequenceRunRequest,
  testSequenceStopRequest,
} from "@/renderer/routes/test_sequencer_panel/models/models";
import { TestSequenceElement } from "@/renderer/types/test-sequencer";
import { ImportTestModal } from "./ImportTestModal";
import LockableButton from "./lockable/LockedButtons";
import { TSWebSocketContext } from "@/renderer/context/testSequencerWS.context";
import { LockedContextProvider } from "@/renderer/context/lock.context";
import _ from "lodash";
import {
  LAYOUT_TOP_HEIGHT,
  BOTTOM_STATUS_BAR_HEIGHT,
} from "@/renderer/routes/common/Layout";
import { TestSequencerProjectModal } from "./TestSequencerProjectModal";
import {
  useImportProject,
  useSaveProject,
  useCloseProject,
} from "@/renderer/hooks/useTestSequencerProject";

const TestSequencerView = () => {
  const { setElems, tree, setIsLocked, backendState, project } =
    useTestSequencerState();
  const { tSSendJsonMessage } = useContext(TSWebSocketContext);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

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

  return (
    <LockedContextProvider>
      <TestSequencerProjectModal
        isProjectModalOpen={isProjectModalOpen}
        handleProjectModalOpen={setIsProjectModalOpen}
      />
      <div
        style={{
          height: `calc(100vh - ${LAYOUT_TOP_HEIGHT + BOTTOM_STATUS_BAR_HEIGHT}px)`,
        }}
      >
        <ImportTestModal
          isModalOpen={isImportModalOpen}
          handleModalOpen={setIsImportModalOpen}
        />
        <div className="flex overflow-y-auto">
          <div
            className="ml-auto mr-auto h-3/5 flex-grow flex-col overflow-y-auto"
            style={{ height: "calc(100vh - 260px)" }}
          >
            <SummaryTable />
            <DataTable />
          </div>

          <div>
            <div className="top-0 h-full flex-none overflow-y-auto pl-5">
              <CloudPanel />
              <div className="mt-5 rounded-xl border border-gray-300 p-4 py-4 dark:border-gray-800">
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
            </div>
          </div>
        </div>
      </div>
    </LockedContextProvider>
  );
};

export default TestSequencerView;
