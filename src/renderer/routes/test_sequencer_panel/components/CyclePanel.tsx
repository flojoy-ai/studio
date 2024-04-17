import _ from "lodash";
import { Input } from "@/renderer/components/ui/input";
import { useDisplayedSequenceState } from "@/renderer/hooks/useTestSequencerState";
import LockableButton from "./lockable/LockedButtons";
import { Checkbox } from "@/renderer/components/ui/checkbox";
import { Button } from "@/renderer/components/ui/button";
import { CycleConfig } from "@/renderer/types/test-sequencer";
import { useShallow } from "zustand/react/shallow";
import { useSequencerStore } from "@/renderer/stores/sequencer";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/renderer/components/ui/hover-card";
import { useState } from "react";

export function CyclePanel() {
  const { tree, isLocked } = useDisplayedSequenceState();

  const {
    cycleRuns,
    cycleConfig,
    sequences,
    setCycleCount,
    setInfinite,
    displayPreviousCycle,
    displayNextCycle,
  } = useSequencerStore(
    useShallow((state) => ({
      cycleRuns: state.cycleRuns,
      cycleConfig: state.cycleConfig,
      sequences: state.sequences,
      setCycleCount: state.setCycleCount,
      setInfinite: state.setInfinite,
      displayPreviousCycle: state.displayPreviousCycle,
      displayNextCycle: state.displayNextCycle,
    })),
  );
  const cycleDisplay = getNumberOfCycleRun(cycleConfig);

  if (sequences.length === 0) {
    return null;
  }

  const [value, setValue] = useState(cycleConfig.cycleCount);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value !== "") {
      setCycleCount(Number(event.target.value));
    }
    setValue(Number(event.target.value));
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">
          <code className="inline-flex translate-y-[1px] items-center justify-center text-sm text-muted-foreground">
            {" "}
            Cycle {cycleDisplay}
          </code>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="mt-2">
        <div>
          <h2 className="text-center text-lg font-bold text-accent1">
            Cycle Configuration
          </h2>
          <div className="my-3 flex items-center gap-2">
            <div className="ml-4 flex items-center gap-2">
              <p className="text-xs text-muted-foreground">Cycle</p>
              <Input
                className="h-7 w-16 text-xs"
                type="number"
                id="cycle"
                placeholder="1"
                disabled={cycleConfig.infinite}
                value={value}
                onChange={handleChange}
              />
            </div>
            <div className="grow" />
            <div className="mr-4 flex items-center gap-2">
              <p className="text-xs text-muted-foreground">Infinite</p>
              <Checkbox
                className="relative z-20 my-2"
                checked={cycleConfig.infinite}
                onCheckedChange={setInfinite}
                aria-label="Select row"
              />
            </div>
          </div>

          <hr />

          <div className="mt-3 flex items-center gap-2">
            <LockableButton
              variant="outline"
              isLocked={_.isEmpty(tree)}
              onClick={displayPreviousCycle}
              className="h-6"
              disabled={cycleConfig.ptrCycle <= 0 || isLocked}
            >
              <p className="text-xs"> Previous Cycle </p>
            </LockableButton>
            <LockableButton
              variant="outline"
              isLocked={_.isEmpty(tree)}
              onClick={displayNextCycle}
              className="h-6"
              disabled={
                cycleConfig.ptrCycle >= cycleRuns.length - 1 ||
                cycleConfig.ptrCycle === -1 ||
                isLocked
              }
            >
              <p className="text-xs"> Next Cycle </p>
            </LockableButton>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

const getNumberOfCycleRun = (cycle: CycleConfig): string => {
  if (cycle.infinite) {
    return cycle.ptrCycle + 1 + "/∞";
  }
  return cycle.ptrCycle + 1 + "/" + cycle.cycleCount;
};
