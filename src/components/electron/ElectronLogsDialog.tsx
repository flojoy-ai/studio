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
  title?: string;
  description?: string;
  logs: string[];
};

const ElectronLogsDialog = ({
  logs,
  open,
  setOpen,
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
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogContent className="sm:max-w-2xl md:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="max-h-[600px] overflow-hidden overflow-y-scroll">
          {logs.map((output, i) => (
            <div
              key={output}
              ref={i === logs.length - 1 ? lastElem : null}
              className={cn(
                "overflow-hidden whitespace-break-spaces bg-background px-2 font-mono",
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
