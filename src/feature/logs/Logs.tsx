import { useEffect, useRef, useState } from "react";
import { LAYOUT_TOP_HEIGHT } from "../common/Layout";
import { cn } from "@src/lib/utils";
import { Button } from "@src/components/ui/button";
import { ChevronsUp, ChevronsDown } from "lucide-react";
import { baseClient } from "@src/lib/base-client";

const Logs = () => {
  const [outputs, setOutputs] = useState<string[]>([]);
  const [minimize, setMinimize] = useState(true);
  const lastElem = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastElem.current?.scrollIntoView) {
      if (!minimize) {
        lastElem.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [outputs.length, minimize]);
  const fetchLogs = async () => {
    if ("api" in window && window.api.isPackaged) {
      const logs = await window.api.getBackendLogs();
      setOutputs(logs.split("\n"));
    }
     else {
      const res = await baseClient.get("logs");
      setOutputs(res.data.split("\n"));
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLogs();
    }, 1500);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <div
      className={cn(
        "fixed bottom-0 z-30 mt-6 w-full translate-y-[calc(100%-36px)] transition-transform duration-700 ease-linear",
        { "translate-y-0": !minimize },
      )}
    >
      <div
        className="relative overflow-y-scroll"
        style={{ maxHeight: `calc(100vh - ${LAYOUT_TOP_HEIGHT}px)` }}
      >
        <div className="sticky right-0 top-0 z-50 flex h-9 w-full justify-end">
          <Button
            variant={"ghost"}
            className="w-28 rounded-none bg-slate-300"
            onClick={() => setMinimize((p) => !p)}
          >
            {minimize ? <ChevronsUp size={20} /> : <ChevronsDown size={20} />}
            Logs
          </Button>
        </div>
        <div
          className={cn("pt-2 transition-all duration-1000 ease-linear", {
            hidden: minimize,
          })}
        >
          {outputs.map((output, i) => (
            <div
              key={`${output}-${i}`}
              ref={i === outputs?.length - 1 ? lastElem : null}
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
      </div>
    </div>
  );
};

export default Logs;
