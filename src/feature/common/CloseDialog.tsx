import { Button } from "@src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@src/components/ui/dialog";

type CloseDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm?: () => void;
};

export const WarnUnsavedChangesDialog = ({
  open,
  setOpen,
  onConfirm,
}: CloseDialogProps) => {
  const handleSubmit = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Confirm exit</DialogTitle>
          <DialogDescription>
            You have unsaved changes. Are you sure you want to quit?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
