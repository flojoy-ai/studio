import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { Label } from "@src/components/ui/label";
import { Switch } from "@src/components/ui/switch";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const MicrocontollerBtn = () => {
  
  const {isMicrocontrollerMode, setIsMicrocontrollerMode} = useFlowChartState()

  const handleClick = () => {
    setIsMicrocontrollerMode(!isMicrocontrollerMode);
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={isMicrocontrollerMode}
        onCheckedChange={handleClick}
        data-testid="microcontroller-mode-toggle"
      />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Label>Microcontroller Mode</Label>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              The flowchart will generate a micropython script you can use on your microcontoller
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default MicrocontollerBtn;
