import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@src/components/ui/dialog";
import { cn } from "@src/lib/utils";
import { useEffect, useRef, useState } from "react";

const BackendInitLogsDialog = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState<string | undefined>("");
  const [outputs, setOutputs] = useState<string[]>([]);
  const lastElem = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastElem.current?.scrollIntoView) {
      lastElem.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [outputs.length]);

  useEffect(() => {
    // This assumes that you've exposed ipcRenderer securely via preload.js
    window.api?.receive("backend", (data) => {
      if (typeof data === "object" && data !== null) {
        setOpen(data.open);
        if (data.title) {
          setTitle(data.title);
        }
        if (data.description) {
          setDescription(data.description);
        }
        if(data.clear){
          setOutputs([])
        }
        setOutputs((p) => [...p, data.output]);
      } else {
        setOpen(true);
        setOutputs((p) => [...p, data]);
      }
    });
  }, []);

  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogContent className="max-h-[600px] overflow-y-scroll sm:max-w-2xl md:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {outputs.map((output, i) => (
          <div
            key={output}
            ref={i === outputs.length - 1 ? lastElem : null}
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
      </DialogContent>
    </Dialog>
  );
};

export default BackendInitLogsDialog;
