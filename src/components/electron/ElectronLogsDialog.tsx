import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@src/components/ui/dialog";
import { cn } from "@src/lib/utils";
import { SetStateAction, useEffect, useRef } from "react";

type ElectronLogsDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  logs: string[];
  title?: string;
  description?: string;
};

const ElectronLogsDialog = ({
  open,
  setOpen,
  logs,
  title,
  description,
}: ElectronLogsDialogProps) => {
  const lastElem = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastElem.current?.scrollIntoView) {
      lastElem.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs.length]);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(false);
      }}
    >
      <DialogContent className="sm:max-w-2xl md:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="max-h-[600px] gap-2 overflow-hidden overflow-y-scroll">
          {logs.map((output, i) => (
            <div
              key={output}
              ref={i === logs.length - 1 ? lastElem : null}
              className={cn(
                "mb-4 overflow-hidden whitespace-break-spaces bg-background font-mono",
                output.toLowerCase().includes("error")
                  ? "text-red-700"
                  : "text-muted-foreground",
              )}
            >
              {output}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ElectronLogsDialog;
