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
import { Button } from "@src/components/ui/button";
import { Eraser } from "lucide-react";

type ClearCanvasBtnProps = {
  clearCanvas: () => void;
};

export const ClearCanvasBtn = ({ clearCanvas }: ClearCanvasBtnProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          data-testid="clear-canvas-btn"
          className="gap-2"
          variant="ghost"
        >
          <Eraser />
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
          <AlertDialogAction onClick={clearCanvas}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
