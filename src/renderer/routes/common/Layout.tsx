import Header from "./Header";
import { useSocket } from "@/renderer/hooks/useSocket";
import { Input } from "@/renderer/components/ui/input";
import { Outlet } from "react-router-dom";
import StatusBar from "@/renderer/routes/common/StatusBar";
import { useProjectStore } from "@/renderer/stores/project";
import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "@/renderer/stores/app";

export const HEADER_HEIGHT = 72;
export const ACTIONS_HEIGHT = 52;
const SERVER_STATUS_HEIGHT = 32;
export const BOTTOM_STATUS_BAR_HEIGHT = 64;

export const LAYOUT_TOP_HEIGHT =
  HEADER_HEIGHT + ACTIONS_HEIGHT + SERVER_STATUS_HEIGHT;

export const Layout = () => {
  const { serverStatus } = useSocket();

  const { setProjectName, projectName, hasUnsavedChanges } = useProjectStore(
    useShallow((state) => ({
      setProjectName: state.setProjectName,
      projectName: state.name,
      hasUnsavedChanges: state.hasUnsavedChanges,
    })),
  );

  const { activeTab } = useAppStore(
    useShallow((state) => ({
      activeTab: state.activeTab,
    })),
  );

  return (
    <div>
      <div className="relative bg-background px-8 pb-2">
        {(activeTab === "Visual Python Script" ||
          activeTab === "Control Panel") && (
          <div className="absolute left-10 top-1.5 flex items-center gap-x-1 rounded-md p-1">
            <Input
              className={
                "h-6 w-28 overflow-hidden overflow-ellipsis whitespace-nowrap border-muted/60 text-sm focus:border-muted-foreground focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 sm:w-48"
              }
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Untitled project"
            />
            {hasUnsavedChanges && (
              <div className=" h-2 w-2 rounded-full bg-foreground/50" />
            )}
          </div>
        )}
        <div
          data-cy="app-status"
          id="app-status"
          className="flex items-center justify-center text-sm"
          style={{
            height: SERVER_STATUS_HEIGHT,
          }}
        >
          <code>{serverStatus}</code>
        </div>
        <div />
        <Header />
      </div>
      <main
        className="bg-background"
        style={{
          height: `calc(100vh - ${
            LAYOUT_TOP_HEIGHT + BOTTOM_STATUS_BAR_HEIGHT
          }px)`,
        }}
      >
        <Outlet />
      </main>
      <StatusBar />
    </div>
  );
};
