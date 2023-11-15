import { useEffect, useRef, useState } from "react";
import { LAYOUT_TOP_HEIGHT } from "../common/Layout";
import { cn } from "@src/lib/utils";
import { Button } from "@src/components/ui/button";
import { ChevronsUp, ChevronsDown } from "lucide-react";

const Logs = ({ logs }: { logs: string[] }) => {
  const [minimize, setMinimize] = useState(true);
  const lastElem = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastElem.current?.scrollIntoView) {
      if (!minimize) {
        lastElem.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [minimize, logs?.length]);
  return (
    <div
      className={cn(
        "fixed bottom-0 z-30 mt-6 w-full translate-y-[calc(100%-36px)] transition-transform duration-700 ease-in-out",
        { "translate-y-0": !minimize },
      )}
    >
      <div
        className={cn("relative", { "overflow-y-scroll": !minimize })}
        style={{ maxHeight: `calc(100vh - ${LAYOUT_TOP_HEIGHT}px)` }}
      >
        <div className="sticky right-0 top-0 z-50 flex h-9 w-full justify-end">
          <Button
            variant={"ghost"}
            className="w-28 rounded-none border-2 border-accent bg-slate-200 dark:bg-accent "
            onClick={() => setMinimize((p) => !p)}
          >
            {minimize ? <ChevronsUp size={20} /> : <ChevronsDown size={20} />}
            Logs
          </Button>
        </div>
        <div
          className={cn(
            "bg-background p-7 pt-2 transition-all duration-1000 ease-in-out ",
            {
              hidden: minimize,
            },
            "light:border-slate-700 border-t dark:border-slate-300",
          )}
        >
          {logs.map((log, i) => (
            <div
              key={`${log}-${i}`}
              ref={i === logs?.length - 1 ? lastElem : null}
              className={cn(
                "overflow-hidden whitespace-break-spaces bg-background py-2 font-mono text-sm",
                log.toLowerCase().includes("error")
                  ? "text-red-700"
                  : "text-muted-foreground",
              )}
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Logs;
