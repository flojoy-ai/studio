import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

type ConfirmPromptProps = {
  open: boolean;
  handleOpenChange: (open: boolean) => void;
  handleConfirm: () => void;
  title?: string;
  description: string;
  confirmBtnText: string;
};
const ConfirmPrompt = ({
  open,
  handleOpenChange,
  handleConfirm,
  confirmBtnText,
  title,
  description,
}: ConfirmPromptProps) => {
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title ?? "Are you sure?"}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            {confirmBtnText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmPrompt;
