// import { Button } from "@/renderer/components/ui/button";
// import { Input } from "@/renderer/components/ui/input";
// import { IS_CLOUD_DEMO } from "@/renderer/data/constants";
import { useContext, useState } from "react";
import { DataTable } from "./DataTable";
import { SummaryTable } from "./SummaryTable";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import { testSequenceRunRequest } from "../models/models";
import { TestSequenceElement } from "@/renderer/types/testSequencer";
import { ImportTestModal } from "./ImportTestModal";
import LockableButton from "./lockable/LockedButtons";
import { TSWebSocketContext } from "../../../context/testSequencerWS.context";
import { LockedContextProvider } from "@/renderer/context/lock.context";

// const INPUT_FIELD_STYLE =
//   "h-10 w-28 overflow-hidden overflow-ellipsis whitespace-nowrap border-muted/60 text-sm focus:border-muted-foreground focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 sm:w-48";

const TestSequencerView = () => {
  // const [deviceId, setDeviceID] = useState("");
  // const [testRunTag, setTestRunTag] = useState("");
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
      <div className="absolute ml-auto mr-auto h-2/3 w-full flex-col space-y-5 overflow-y-auto">
        <ImportTestModal
          isModalOpen={isImportModalOpen}
          handleModalOpen={setIsImportModalOpen}
          handleImport={() => {}}
        ></ImportTestModal>
        {/* New Test Form */}
        {/* <div className="flex flex-row space-x-5"> */}
        {/*   <Input */}
        {/*     className={INPUT_FIELD_STYLE} */}
        {/*     value={deviceId} */}
        {/*     onChange={(e) => setDeviceID(e.target.value)} */}
        {/*     placeholder="Device ID (optional)" */}
        {/*     disabled={IS_CLOUD_DEMO} */}
        {/*   /> */}
        {/*   <Input */}
        {/*     className={INPUT_FIELD_STYLE} */}
        {/*     value={testRunTag} */}
        {/*     onChange={(e) => setTestRunTag(e.target.value)} */}
        {/*     placeholder="Test Run Tag (optional)" */}
        {/*     disabled={IS_CLOUD_DEMO} */}
        {/*   /> */}
        {/*   <Button>New Test</Button> */}
        {/* </div> */}

        <div className="w-5/6">
          <DataTable />
          <SummaryTable />
        </div>

        {/* Test Flow Control buttons */}
        <div className="flex flex-row space-x-5">
          <LockableButton onClick={handleClickImportTest}>
            + Import test
          </LockableButton>
          {/* <LockableButton>Save test run</LockableButton> */}
          {/* <LockableButton>Export test</LockableButton> */}
          <LockableButton onClick={handleClickRunTest}>Run Test</LockableButton>
        </div>
      </div>
    </LockedContextProvider>
  );
};

export default TestSequencerView;
