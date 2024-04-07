import LockableButton from "./lockable/LockedButtons";
import { useSequencerTestState, useSequencerState } from "@/renderer/hooks/useTestSequencerState";
import _ from "lodash";
import {
  testSequenceStopRequest,
  testSequencePauseRequest,
  testSequenceResumeRequest,
} from "@/renderer/routes/test_sequencer_panel/models/models";
import { TSWebSocketContext } from "@/renderer/context/testSequencerWS.context";
import { useContext } from "react";
import { Button } from "@/renderer/components/ui/button";
import { Pause, Play, Square } from "lucide-react";
import { toast } from "sonner";

export function ControlButton() {
  const { tree, setIsLocked, backendGlobalState, backendState } = useSequencerTestState();
  const { runSequencer } = useSequencerState(); 
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
  };

  const handleClickResumeTest = () => {
    toast.info("Resuming sequencer.");
    if (backendGlobalState === "test_set_start") {
      console.log("Resume test");
      tSSendJsonMessage(testSequenceResumeRequest(tree));
    }
  };

  return (
    <div>
      <div className="mr-6 mt-6">
        {backendGlobalState !== "test_set_start" ? (
          <LockableButton
            variant="dotted"
            className="w-28 gap-2 px-4 py-2"
            isLocked={_.isEmpty(tree)}
            onClick={handleClickRunTest}
            data-testid="run-test-btn"
          >
            <Play size={18} />
            Play
          </LockableButton>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="dotted"
              size="icon"
              onClick={handleClickStopTest}
              className="w-15 gap-2 bg-destructive px-5 text-destructive-foreground hover:bg-destructive/90"
            >
              <Square size={18} />
              Abort
            </Button>
            <Button
              disabled={backendState !== "paused"}
              variant="dotted"
              size="icon"
              onClick={handleClickResumeTest}
              className="w-15 gap-2 px-5"
            >
              <Play size={18} />
              Resume
            </Button>
            <Button
              disabled={backendState !== "running"}
              variant="dotted"
              size="icon"
              onClick={handleClickPauseTest}
              className="w-15 gap-2 px-5"
            >
              <Pause size={18} />
              Pause
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
