import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { IS_CLOUD_DEMO } from "@src/data/constants";
import { useContext, useState } from "react";
import { DataTable } from "./DataTable";
import { SummaryTable } from "./SummaryTable";
import { useTestSequencerState } from "@src/hooks/useTestSequencerState";
import { testSequenceRunRequest } from "../models/models";
import TSWebSocketContext from "../context/TSWebSocketContext";
import { TestSequenceElement } from "@src/types/testSequencer";
import { ImportTestModal } from "./ImportTestModal";

const INPUT_FIELD_STYLE =
  "h-10 w-28 overflow-hidden overflow-ellipsis whitespace-nowrap border-muted/60 text-sm focus:border-muted-foreground focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 sm:w-48";

const TestSequencerView = () => {
  const [deviceId, setDeviceID] = useState("");
  const [testRunTag, setTestRunTag] = useState("");
  const { setElems, tree } = useTestSequencerState();
  const { tSSendJsonMessage } = useContext(TSWebSocketContext);

  const resetStatus = () => {
    setElems((elems: TestSequenceElement[]) => {
      const new_elems = [...elems];
      return new_elems.map((elem) => {
        return elem.type === "test"
          ? { ...elem, status: "pending", completionTime: null }
          : { ...elem };
      });
    });
  };

  const handleClickRunTest = () => {
    resetStatus();
    tSSendJsonMessage(testSequenceRunRequest(tree));
  };

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const handleClickImportTest = () => {
    setIsImportModalOpen(true);
  };

  return (
    <div className="absolute h-3/4 w-full flex-col space-y-5 overflow-y-auto">
      <ImportTestModal
        isModalOpen={isImportModalOpen}
        handleModalOpen={setIsImportModalOpen}
        handleImport={() => {}}
      ></ImportTestModal>
      {/* New Test Form */}
      <div className="flex flex-row space-x-5">
        <Input
          className={INPUT_FIELD_STYLE}
          value={deviceId}
          onChange={(e) => setDeviceID(e.target.value)}
          placeholder="Device ID (optional)"
          disabled={IS_CLOUD_DEMO}
        />
        <Input
          className={INPUT_FIELD_STYLE}
          value={testRunTag}
          onChange={(e) => setTestRunTag(e.target.value)}
          placeholder="Test Run Tag (optional)"
          disabled={IS_CLOUD_DEMO}
        />
        <Button>New Test</Button>
      </div>

      <div className="w-5/6">
        <DataTable />
        <SummaryTable />
      </div>

      {/* Test Flow Control buttons */}
      <div className="flex flex-row space-x-5">
        <Button onClick={handleClickImportTest}>+ Import test</Button>
        <Button>Save test run</Button>
        <Button>Export test</Button>
        <Button onClick={handleClickRunTest}>Run Test</Button>
      </div>
    </div>
  );
};

export default TestSequencerView;
