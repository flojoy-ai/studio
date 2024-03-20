import LockableButton from "./lockable/LockedButtons";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import _ from "lodash";
import { TestSequenceElement } from "@/renderer/types/test-sequencer";
import {
  testSequenceRunRequest,
  testSequenceStopRequest,
} from "@/renderer/routes/test_sequencer_panel/models/models";
import { TSWebSocketContext } from "@/renderer/context/testSequencerWS.context";
import { useContext } from "react";
import { Button } from "@/renderer/components/ui/button";
import { PauseIcon, PlayIcon } from "lucide-react";


export function ControlButton() {
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


  return (
    <div className="flex w-full mt-4">
        <LockableButton
          variant="dotted"
          className="gap-2 flex-grow"
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
      {/*
        <Button disabled={true} className="flex-none m-2 mt-3.5" variant="outline" size="icon">
          <PlayIcon className="h-4 w-4 bg-grey" />
        </Button>
        <Button disabled={true} className="flex-none m-2 mt-3.5" variant="outline" size="icon">
          <PauseIcon className="h-4 w-4 bg-grey" />
        </Button>
      */}

    </div>
  );
}
