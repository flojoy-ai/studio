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
import { Label } from "@/renderer/components/ui/label";
import { Input } from "@/renderer/components/ui/input";
import { Switch } from "@/renderer/components/ui/switch";


export function ControlPanel() {
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
    <div className="rounded-xl border border-gray-300 dark:border-gray-800 mr-4 flex-none">
      <div className="flex flex-col">
        <h2 className="px-4 pt-2 text-lg font-bold text-accent1 ml-1 ">
          Sequencer Controls
        </h2>
        <div className="px-4 flex mb-2">
        <LockableButton
          variant="dotted"
          className="mt-1 gap-2 mt-3"
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

        <div className="grid max-w-sm items-center gap-1.5 ml-4 mt-1">
          <Label className="text-xs text-muted-foreground" htmlFor="cycle">Cycle</Label>
          <Input className="h-7 w-16" type="number" id="cycle" placeholder="1" />
        </div>
        <div className="grid max-w-sm items-center gap-1.5 ml-4">
          <Label className="text-xs text-muted-foreground" htmlFor="infinte">Infinite</Label>
          <Switch id="infinite" />
        </div>
        </div>
      </div>
    </div>
  );
}
