import { memo } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/renderer/components/ui/dialog";
import { Button } from "@/renderer/components/ui/button";

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
};

const FeedbackModal = ({ open, setOpen }: Props) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>We would love to hear what you think!</DialogTitle>
          <DialogDescription>
            Join our Discord community to leave us feedback :)
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button type="submit" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <DialogClose>
            <Button type="submit" asChild>
              <a href="https://discord.gg/7HEBr7yG8c" target="_blank">
                Join
              </a>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default memo(FeedbackModal);
