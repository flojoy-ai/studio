import LockableButton from "./lockable/LockedButtons";
import {
  useDisplayedSequenceState,
  useSequencerState,
} from "@/renderer/hooks/useTestSequencerState";
import _ from "lodash";
import { TSWebSocketContext } from "@/renderer/context/testSequencerWS.context";
import { useContext } from "react";
import { Button } from "@/renderer/components/ui/button";
import { Pause, Play, Square } from "lucide-react";

export function ControlButton() {
  const { tree, backendGlobalState, backendState } =
    useDisplayedSequenceState();
  const { runSequencer, abortSequencer, pauseSequencer, resumeSequencer } =
    useSequencerState();
  const { tSSendJsonMessage } = useContext(TSWebSocketContext);

  const handleClickRun = () => {
    console.log("Run sequencer");
    runSequencer(tSSendJsonMessage);
  };

  const handleClickAbort = () => {
    abortSequencer(tSSendJsonMessage);
  };

  const handleClickPause = () => {
    pauseSequencer(tSSendJsonMessage);
  };

  const handleClickResume = () => {
    resumeSequencer(tSSendJsonMessage);
  };

  return (
    <div>
      <div className="mr-6 mt-6">
        {backendGlobalState !== "test_set_start" ? (
          <LockableButton
            variant="dotted"
            className="w-28 gap-2 px-4 py-2"
            isLocked={_.isEmpty(tree)}
            onClick={handleClickRun}
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
              onClick={handleClickAbort}
              className="w-15 gap-2 bg-destructive px-5 text-destructive-foreground hover:bg-destructive/90"
            >
              <Square size={18} />
              Abort
            </Button>
            <Button
              disabled={backendState !== "paused"}
              variant="dotted"
              size="icon"
              onClick={handleClickResume}
              className="w-15 gap-2 px-5"
            >
              <Play size={18} />
              Resume
            </Button>
            <Button
              disabled={backendState !== "running"}
              variant="dotted"
              size="icon"
              onClick={handleClickPause}
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
