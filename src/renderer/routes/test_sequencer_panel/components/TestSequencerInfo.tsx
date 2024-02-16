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


const TestSequencerView = () => {

  const { setElems, tree, setIsLocked } = useTestSequencerState();
  const { tSSendJsonMessage } = useContext(TSWebSocketContext);

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

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const handleClickImportTest = () => {
    setIsImportModalOpen(true);
  };

  return (
    <LockedContextProvider>
      <div>
        <ImportTestModal
          isModalOpen={isImportModalOpen}
          handleModalOpen={setIsImportModalOpen}
          handleImport={() => {}}
        ></ImportTestModal>
        <div className="absolute ml-auto mr-auto h-2/3 w-full flex-col space-y-5 overflow-y-auto">
          <div class="flex">
            <div className="w-4/5  h-2/3 w-full flex-col space-y-5 overflow-y-auto">
              <SummaryTable />
              <DataTable />
            </div>
            
          </div>
        </div>

      <div class="flex justify-end">
        <div className="flex-none w-1/6 pl-5 sticky top-0">
          <CloudPanel />
          <div className="rounded-xl border border-gray-300 rounded-xl border border-gray-300 py-4 dark:border-gray-800 p-4 mt-5"> 
            <div class="flex flex-col">
              <h2 className="mb-2 text-lg font-bold text-accent1 pt-3 text-center "> Control Panel </h2>
              <div>
                <LockableButton
                  className="w-full mt-4"
                  variant="outline"
                  onClick={handleClickImportTest}
                >
                  Import Python Tests 
                </LockableButton>
              </div>
              <LockableButton className="w-full mt-4" variant="outline">Import Test Run</LockableButton>
              <LockableButton className="w-full mt-4" variant="outline">Export Test Run</LockableButton>

              <LockableButton
                data-cy="btn-play"
                data-testid="btn-play"
                variant="dotted"
                id="btn-play"
                className="w-full gap-2 mt-4"
                onClick={handleClickRunTest}
              >
                Run Test Sequence
              </LockableButton>
            </div>
          </div>
        </div>
      </div>
      </div>
    </LockedContextProvider>
  );
};

export default TestSequencerView;
