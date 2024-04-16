import { Badge } from "@/renderer/components/ui/badge";
import { ServerStatus } from "@/renderer/types/socket";
import { useEffect, useRef, useState } from "react";
import {
  BOTTOM_STATUS_BAR_HEIGHT,
  LAYOUT_TOP_HEIGHT,
} from "@/renderer/routes/common/Layout";
import { cn } from "@/renderer/lib/utils";
import { Button } from "@/renderer/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { useSocketStore } from "@/renderer/stores/socket";
// eslint-disable-next-line no-restricted-imports
import packageJson from "../../../../package.json";
import { useAppStore } from "@/renderer/stores/app";
import { useShallow } from "zustand/react/shallow";

const StatusBar = (): JSX.Element => {
  const [messages, setMessages] = useState<string[]>([]);
  const serverStatus = useSocketStore((state) => state.serverStatus);
  const [minimize, setMinimize] = useState(true);
  const lastElem = useRef<HTMLDivElement>(null);
  const { activeTab } = useAppStore(
    useShallow((state) => ({
      activeTab: state.activeTab,
    })),
  );

  useEffect(() => {
    if (lastElem.current?.scrollIntoView) {
      if (!minimize) {
        lastElem.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [minimize]);
  const handleDownloadLogs = () => {
    window.api.downloadLogs();
  };
  // Listen for messages from the main process
  useEffect(() => {
    window.api.subscribeToElectronLogs((data) => {
      setMessages((prev) => (prev.includes(data) ? prev : [...prev, data]));
    });
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-0 z-30 w-full translate-y-[calc(100%-40px)] transition-transform duration-700 ease-in-out",
        { "translate-y-0": !minimize },
      )}
    >
      <div
        className={cn("relative flex", {
          "flex-col justify-start overflow-y-scroll ": !minimize,
          "row h-10 items-center justify-between bg-background": minimize,
        })}
        style={{
          maxHeight: `calc(100vh - ${
            LAYOUT_TOP_HEIGHT + BOTTOM_STATUS_BAR_HEIGHT
          }px)`,
        }}
      >
        {minimize && (
          <div className="flex w-full min-w-fit items-center gap-2 ps-2">
            <div>
              {![ServerStatus.OFFLINE, ServerStatus.CONNECTING].includes(
                serverStatus,
              ) ? (
                <Badge variant="outline">
                  Operational - {packageJson.version}
                </Badge>
              ) : (
                <Badge variant={"destructive"}>
                  Disconnected - {packageJson.version}
                </Badge>
              )}
            </div>
            {activeTab !== "Test Sequencer" &&
            activeTab !== "Device Manager" ? (
              <>
                <div
                  data-cy="app-status"
                  id="app-status"
                  className="ml-2 flex text-xs"
                >
                  <code>{serverStatus}</code>
                </div>
              </>
            ) : (
              <>
                <code className="text-xs w-5/6">
                  {messages[messages.length - 1]?.slice(0, 112)}...
                </code>
              </>
            )}
            <div className="grow" />
          </div>
        )}
        <div
          className={cn(
            "sticky right-0 top-0 z-50 flex h-full w-32 justify-end",
            {
              "w-full p-0": !minimize,
            },
          )}
        >
          <Button
            variant="link"
            className="w-29 text-xs"
            onClick={() => setMinimize((p) => !p)}
          >
            {minimize ? "Expand log" : "Collapse log"}
          </Button>
        </div>
        {!minimize && (
          <Button
            variant="ghost"
            className="fixed bottom-0 right-0 m-1 text-xs"
            onClick={handleDownloadLogs}
          >
            <DownloadIcon size={16} className="mr-2" />
            Download Full Logs
          </Button>
        )}
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
