import { useContext, useState } from "react";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import {
  testSequenceRunRequest,
  testSequenceStopRequest,
} from "../../models/models";
import { TestSequenceElement } from "@/renderer/types/testSequencer";
import { ImportTestModal } from "../ImportTestModal";
import LockableButton from "../lockable/LockedButtons";
import { TSWebSocketContext } from "@/renderer/context/testSequencerWS.context";
import { useTestSetSave } from "@/renderer/hooks/useTestSetSave";
import { useTestSetImport } from "@/renderer/hooks/useTestSetImport";
import _ from "lodash";

export const ControlPanel = () => {
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
    <div>
      <ImportTestModal
        isModalOpen={isImportModalOpen}
        handleModalOpen={setIsImportModalOpen}
      />

      <div className="mt-5 rounded-xl border border-gray-300 p-4 py-4 dark:border-gray-800">
        <div className="flex flex-col">
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
  );
};
