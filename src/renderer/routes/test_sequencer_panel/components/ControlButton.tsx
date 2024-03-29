import LockableButton from "./lockable/LockedButtons";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import _ from "lodash";
import {
  testSequenceStopRequest,
  testSequencePauseRequest,
  testSequenceResumeRequest,
} from "@/renderer/routes/test_sequencer_panel/models/models";
import { TSWebSocketContext } from "@/renderer/context/testSequencerWS.context";
import { useContext, useEffect, useState } from "react";
import { Button } from "@/renderer/components/ui/button";
import { PauseIcon, PlayIcon } from "lucide-react";
import { toast } from "sonner";
import { CyclePanel } from "./CyclePanel";


export function ControlButton() {
  const { tree, setIsLocked, backendGlobalState, backendState, runSequencer } = useTestSequencerState();
  const { tSSendJsonMessage } = useContext(TSWebSocketContext);

  const handleClickRunTest = () => {
    console.log("Run sequencer");
    runSequencer(tSSendJsonMessage);
  };

  const handleClickStopTest = () => {
    toast.warning("Stopping sequencer after this test.");
    tSSendJsonMessage(testSequenceStopRequest(tree));
    setIsLocked(false);
  };

  const handleClickPauseTest = () => {
    toast.warning("Pausing sequencer after this test.");
    if (backendGlobalState === "test_set_start") {
      console.log("Pause test");
      tSSendJsonMessage(testSequencePauseRequest(tree));
    }
  }

  const handleClickResumeTest = () => {
    toast.info("Resuming sequencer.");
    if (backendGlobalState === "test_set_start") {
      console.log("Resume test");
      tSSendJsonMessage(testSequenceResumeRequest(tree));
    }
  }

  return (
    <div>
      <div className="flex my-4 ml-5 mr-2 px-2">
        {backendGlobalState !== "test_set_start" ? (
        <LockableButton
          variant="dotted"
          className="gap-2 flex-grow"
          isLocked={_.isEmpty(tree)}
          onClick={handleClickRunTest}
        >
          Run Test Sequences
        </LockableButton>
        ) : (
          <div className={`flex flex-grow w-3/4 gap-4`}>
            <Button
              className="gap-2 flex-grow"
              variant="dotted" 
              size="icon"
              onClick={handleClickStopTest}
            >
              Stop
            </Button>
            <Button
              className="gap-2 flex-grow"
              disabled={backendState !== "paused"} 
              variant="dotted" 
              size="icon"
              onClick={handleClickResumeTest}
            >
              Play
            </Button>
            <Button 
              className="gap-2 flex-grow"
              disabled={backendState !== "running"} 
              variant="dotted" 
              size="icon"
              onClick={handleClickPauseTest} 
            >
              Pause
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
