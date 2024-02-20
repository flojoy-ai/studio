// import { Button } from "@/renderer/components/ui/button";
// import { Input } from "@/renderer/components/ui/input";
// import { IS_CLOUD_DEMO } from "@/renderer/data/constants";
import { useContext, useState } from "react";
import { DataTable } from "./DataTable";
import { SummaryTable } from "./SummaryTable";
import { CloudPanel } from "./CloudPanel";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import { testSequenceRunRequest } from "../models/models";
import { TestSequenceElement } from "@/renderer/types/testSequencer";
import { ImportTestModal } from "./ImportTestModal";
import LockableButton from "./lockable/LockedButtons";
import { TSWebSocketContext } from "../../../context/testSequencerWS.context";
import { LockedContextProvider } from "@/renderer/context/lock.context";
import { useTestSetSave } from "@/renderer/hooks/useTestSetSave";
import { useTestSetImport } from "@/renderer/hooks/useTestSetImport";


const TestSequencerView = () => {

  const { setElems, tree, setIsLocked } = useTestSequencerState();
  const { tSSendJsonMessage } = useContext(TSWebSocketContext);
  const [addIfStatement, setAddIfStatement] = useState(false);

  const resetStatus = () => {
    setElems.withException((elems: TestSequenceElement[]) => {
      const new_elems: TestSequenceElement[] = [...elems].map((elem) => {
        return elem.type === "test"
          ? { ...elem, status: "pending", completionTime: undefined }
          : { ...elem };
      });
      return new_elems;
    });
  };

  const handleClickRunTest = () => {
    setIsLocked(true);
    resetStatus();
    tSSendJsonMessage(testSequenceRunRequest(tree));
  };
  const testSetSave = useTestSetSave();
  const testSetImport = useTestSetImport();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const handleClickImportTest = () => {
    setIsImportModalOpen(true);
  };
  const handleClickSaveTestSet = () => {
    testSetSave();
  };
  const handleClickImportTestTest = () => {
    testSetImport();
  };

  return (
    <LockedContextProvider>
      <ImportTestModal
        isModalOpen={isImportModalOpen}
        handleModalOpen={setIsImportModalOpen}
        handleImport={() => {}}
      ></ImportTestModal>
      <div className="flex">
        <div className="ml-auto mr-auto flex-col flex-grow h-3/5 overflow-y-auto">
          <SummaryTable />
          <DataTable addIfStatement={addIfStatement} setAddIfStatement={setAddIfStatement}/>
        </div>

        <div class="">
          <div className="flex-none pl-5 top-0">
            <CloudPanel />
            <div className="rounded-xl border border-gray-300 rounded-xl border border-gray-300 py-4 dark:border-gray-800 p-4 mt-5"> 
              <div class="flex flex-col">
                <h2 className="mb-2 text-lg font-bold text-accent1 pt-3 text-center "> Control Panel </h2>
                <LockableButton className="w-full mt-4" variant="outline" onClick={handleClickImportTest}> Import Python Tests </LockableButton>
                <LockableButton className="w-full mt-4" variant="outline" onClick={handleClickImportTestTest}> Import Test Set </LockableButton>
                <LockableButton className="w-full mt-4" variant="outline" onClick={handleClickSaveTestSet}> Save Test Set </LockableButton>
                <LockableButton
                  data-cy="btn-play"
                  data-testid="btn-play"
                  variant="dotted"
                  id="btn-play"
                  className="w-full gap-2 mt-4"
                  onClick={handleClickRunTest}
                > Run Test Sequence </LockableButton>
              </div>
            </div>
            <div className="rounded-xl border border-gray-300 rounded-xl border border-gray-300 py-4 dark:border-gray-800 p-4 mt-5"> 
              <div class="flex flex-col">
                <h2 className="mb-2 text-lg font-bold text-accent1 pt-3 text-center "> Conditionals Panel </h2>
                <LockableButton className="w-full mt-4" variant="outline" onClick={setAddIfStatement}> Add If Else Statement </LockableButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LockedContextProvider>
  );
};

export default TestSequencerView;
