import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { Label } from "@src/components/ui/label";
import { Switch } from "@src/components/ui/switch";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import useClearCanvas from "../../hooks/useClearCanvas";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@src/components/ui/alert-dialog";

const MicrocontollerBtn = () => {
  const { isMicrocontrollerMode, setIsMicrocontrollerMode } =
    useFlowChartState();
  const clearCanvas = useClearCanvas();

  const handleClick = () => {
    setIsMicrocontrollerMode(!isMicrocontrollerMode);
    clearCanvas();
  };

  return (
    <div className="flex items-center space-x-2">
      <AlertDialog>
        <AlertDialogTrigger>
          <Switch
            checked={isMicrocontrollerMode}
            data-testid="microcontroller-mode-toggle"
          />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Switching modes will wipe the canvas
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will remove everything on the
              flowchart. Please save your work before switching modes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              data-testid="confirm-clear-canvas"
              onClick={handleClick}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Label>Microcontroller Mode</Label>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              The flowchart will generate a micropython script you can use on
              your microcontoller
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default MicrocontollerBtn;
