import { Badge } from "@src/components/ui/badge";
import { useSocket } from "@src/hooks/useSocket";
import { IServerStatus } from "@src/context/socket.context";
import { useEffect, useRef, useState } from "react";
import {
  BOTTOM_STATUS_BAR_HEIGHT,
  LAYOUT_TOP_HEIGHT,
} from "@src/routes/common/Layout";
import { cn } from "@src/lib/utils";
import { Button } from "@src/components/ui/button";

const StatusBar = (): JSX.Element => {
  const [messages, setMessages] = useState<string[]>([]);
  const {
    states: { serverStatus, logs },
  } = useSocket();
  const [minimize, setMinimize] = useState(true);
  const lastElem = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastElem.current?.scrollIntoView) {
      if (!minimize) {
        lastElem.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [minimize, logs?.length]);
  // Listen for messages from the main process
  window.api.subscribeToElectronLogs((data) => {
    setMessages((prev) => (prev.includes(data) ? prev : [...prev, data]));
  });

  return (
    <div
      className={cn(
        "fixed bottom-0 z-30 mt-6 w-full translate-y-[calc(100%-60px)] transition-transform duration-700 ease-in-out",
        { "translate-y-0": !minimize },
      )}
    >
      <div
        className={cn("relative flex", {
          "flex-col justify-start overflow-y-scroll ": !minimize,
          "row items-center justify-between bg-background": minimize,
        })}
        style={{
          maxHeight: `calc(100vh - ${
            LAYOUT_TOP_HEIGHT + BOTTOM_STATUS_BAR_HEIGHT
          }px)`,
        }}
      >
        {minimize && (
          <div className="flex min-w-fit items-center gap-2 ps-2">
            {![IServerStatus.OFFLINE, IServerStatus.CONNECTING].includes(
              serverStatus,
            ) ? (
              <Badge>Operational</Badge>
            ) : (
              <Badge variant={"destructive"}>Disconnected</Badge>
            )}
            <div className="text-sm">
              {messages[messages.length - 1]?.slice(0, 145)}...
            </div>
          </div>
        )}
        <div
          className={cn(
            "sticky right-0 top-0 z-50 flex h-full w-full justify-end p-3",
            {
              "w-full p-0": !minimize,
            },
          )}
        >
          <Button
            variant={"outline"}
            className="w-29 rounded-none  "
            onClick={() => setMinimize((p) => !p)}
          >
            {minimize ? "Expand log" : "Collapse log"}
          </Button>
        </div>
        <div
          className={cn(
            "w-full bg-background p-7 pt-2 transition-all duration-1000 ease-in-out ",
            {
              hidden: minimize,
            },
            "light:border-slate-700 border-t dark:border-slate-300",
          )}
        >
          {(messages.length > 0 ? messages : ["No logs found!"]).map(
            (log, i) => (
              <div
                key={log}
                ref={i === messages?.length - 1 ? lastElem : null}
                className={cn(
                  "overflow-hidden whitespace-break-spaces bg-background py-2 font-mono text-sm",
                  log.toLowerCase().includes("error")
                    ? "text-red-700"
                    : "text-muted-foreground",
                )}
              >
                {log}
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
