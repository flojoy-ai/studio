import { Cable } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { HardwareInfo } from "./HardwareInfo";

type HardwareInfoModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const HardwareInfoModal = ({
  open,
  setOpen,
}: HardwareInfoModalProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button
          onClick={() => setOpen(true)}
          data-testid="app-gallery-btn"
          className="gap-2"
          variant="ghost"
        >
          <Cable size={20} className="stroke-muted-foreground" />
          Devices
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connected Devices</DialogTitle>
        </DialogHeader>
        <HardwareInfo />
      </DialogContent>
    </Dialog>
  );
};
