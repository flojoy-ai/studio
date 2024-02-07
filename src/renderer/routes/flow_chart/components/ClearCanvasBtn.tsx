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
} from "@/renderer/components/ui/alert-dialog";
import { Button } from "@/renderer/components/ui/button";
import { Eraser } from "lucide-react";

type ClearCanvasBtnProps = {
  clearCanvas: () => void;
};

export const ClearCanvasBtn = ({ clearCanvas }: ClearCanvasBtnProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          data-testid="clear-canvas-button"
          className="gap-2"
          variant="ghost"
        >
          <Eraser className="stroke-muted-foreground" size={20} />
          Clear Canvas
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will remove everything on the
            flowchart.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            data-testid="confirm-clear-canvas"
            onClick={clearCanvas}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
