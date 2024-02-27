import { useContext, useState } from "react";
import { DataTable } from "./data-table/DataTable";
import { SummaryTable } from "./SummaryTable";
import { CloudPanel } from "./CloudPanel";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import {
  testSequenceRunRequest,
  testSequenceStopRequest,
} from "../models/models";
import { TestSequenceElement } from "@/renderer/types/testSequencer";
import { ImportTestModal } from "./ImportTestModal";
import LockableButton from "./lockable/LockedButtons";
import { TSWebSocketContext } from "@/renderer/context/testSequencerWS.context";
import { LockedContextProvider } from "@/renderer/context/lock.context";
import { useTestSetSave } from "@/renderer/hooks/useTestSetSave";
import { useTestSetImport } from "@/renderer/hooks/useTestSetImport";
import _ from "lodash";
import {
  LAYOUT_TOP_HEIGHT,
  BOTTOM_STATUS_BAR_HEIGHT,
} from "@/renderer/routes/common/Layout";
import { Button } from "@/renderer/components/ui/button";

const TestSequencerView = () => {
  const { setElems, tree, setIsLocked, backendState } = useTestSequencerState();
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
  const testSetSave = useTestSetSave();
  const testSetImport = useTestSetImport();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const handleClickImportTest = () => {
    setIsImportModalOpen(true);
  };

  return (
    <LockedContextProvider>
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
                  <LockableButton
                    className="mt-4 w-full"
                    variant="outline"
                    onClick={testSetImport}
                  >
                    Import Test Set
                  </LockableButton>
                  <LockableButton
                    className="mt-4 w-full"
                    variant="outline"
                    onClick={testSetSave}
                  >
                    Save Test Set
                  </LockableButton>
                  <LockableButton
                    variant="dotted"
                    className="mt-4 w-full gap-2"
                    isLocked={_.isEmpty(tree)}
                    isException={backendState === "TEST_SET_START"}
                    onClick={
                      backendState === "TEST_SET_START"
                        ? handleClickStopTest
                        : handleClickRunTest
                    }
                  >
                    {backendState === "TEST_SET_START"
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
