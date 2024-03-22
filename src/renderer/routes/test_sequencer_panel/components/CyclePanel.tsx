import _ from "lodash";
import { Label } from "@/renderer/components/ui/label";
import { Input } from "@/renderer/components/ui/input";
import { Switch } from "@/renderer/components/ui/switch";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";


export function CyclePanel() {

  const { cycle, setCycleCount, setInfinite } = useTestSequencerState();

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

        </div>
      </div>
    </div>
  );
}
