import _ from "lodash";
import { Label } from "@/renderer/components/ui/label";
import { Input } from "@/renderer/components/ui/input";
import { Switch } from "@/renderer/components/ui/switch";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import { Button } from "@/renderer/components/ui/button";


export function CyclePanel() {

  const { cycle, setCycleCount, setInfinite, previousCycle, nextCycle } = useTestSequencerState();

  return (
    <div className="rounded-xl border border-gray-300 dark:border-gray-800 mr-4 flex-none">
      <div className="flex flex-col">
        <h2 className="px-4 pt-2 text-lg font-bold text-accent1">
          Cycle Controls
        </h2>
        <div className="px-4 flex mb-2">

          <div className="grid max-w-sm items-center gap-1.5 mt-1">
            <Label className="text-xs text-muted-foreground" htmlFor="cycle">Number</Label>
            <Input 
              className="h-7 w-16" 
              type="number" 
              id="cycle" 
              placeholder="1" 
              disabled={cycle.infinite}
              value={cycle.cycleCount} 
              onChange={(event) => { setCycleCount(Number(event.target.value)); }} />
          </div>

          <div className="grid max-w-sm items-center gap-1.5 ml-4">
            <Label className="text-xs text-muted-foreground" htmlFor="infinte">Infinite</Label>
            <Switch 
              id="infinite"
              checked={cycle.infinite}
              onCheckedChange={setInfinite}
            />
          </div>

          <div className="ml-4">
            <Label className="text-xs text-muted-foreground" htmlFor="checkCycle"> Cycle Navigation </Label>
            <div id="checkCycle" className="flex gap-2 mt-1">
              <Button variant="outline" onClick={previousCycle} className="h-6">←</Button>
              <Button variant="outline" onClick={nextCycle} className="h-6">→</Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
