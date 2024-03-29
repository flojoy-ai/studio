import _ from "lodash";
import { Input } from "@/renderer/components/ui/input";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import LockableButton from "./lockable/LockedButtons";
import { Checkbox } from "@/renderer/components/ui/checkbox";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@radix-ui/react-hover-card";
import { Button } from "@/renderer/components/ui/button";
import { CycleConfig } from "@/renderer/types/test-sequencer";


export function CyclePanel() {

  const { tree, cycleRuns, cycleConfig, setCycleCount, setInfinite, diplayPreviousCycle, displayNextCycle, sequences, isLocked } = useTestSequencerState();
  const cycleDisplay = getNumberOfCycleRun(cycleConfig);

  if (sequences.length === 0) {
    return null;
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">
          <code
            className="inline-flex items-center justify-center text-muted-foreground translate-y-[1px] text-sm"
          > Cycle {cycleDisplay}</code>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-320 mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg border bg-card text-card-foreground shadow-sm px-3 py-2">
        <div>
          <h2 className="mt-2 text-lg font-bold text-accent1 text-center">
            Cycle Configuration
          </h2>
          <div className="flex items-center gap-2 my-3">
            <div className="flex items-center gap-2 ml-4">
              <p className="text-xs text-muted-foreground">Cycle</p>
              <Input 
                className="h-7 w-16 text-xs" 
                type="number" 
                id="cycle" 
                placeholder="1" 
                disabled={cycleConfig.infinite}
                value={cycleConfig.cycleCount} 
                onChange={(event) => { setCycleCount(Number(event.target.value)); }} />
            </div>
            <div className="grow" />
            <div className="flex items-center gap-2 mr-4">
              <p className="text-xs text-muted-foreground">Infinite</p>
              <Checkbox
                className="relative z-20 my-2"
                checked={cycleConfig.infinite}
                onCheckedChange={setInfinite}
                aria-label="Select row"
              />
            </div>
          </div>

          <hr/>

          <div className="flex items-center gap-2 my-3">
            <LockableButton 
              variant="outline"
              isLocked={_.isEmpty(tree)}
              onClick={diplayPreviousCycle} 
              className="h-6"
              disabled={cycleConfig.ptrCycle <= 0 || isLocked }
            >
              <p className="text-xs"> Previous Cycle </p>
            </LockableButton>
            <LockableButton 
              variant="outline" 
              isLocked={_.isEmpty(tree)}
              onClick={displayNextCycle} 
              className="h-6"
              disabled={cycleConfig.ptrCycle >= cycleRuns.length - 1 || cycleConfig.ptrCycle === -1 || isLocked }
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
    return (cycle.ptrCycle + 1) + "/∞";
  }
  return (cycle.ptrCycle + 1) + "/" + cycle.cycleCount;
}

