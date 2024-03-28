import Header from "./Header";
import { Input } from "@/renderer/components/ui/input";
import { Outlet } from "react-router-dom";
import StatusBar from "@/renderer/routes/common/StatusBar";
import { useProjectStore } from "@/renderer/stores/project";
import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "@/renderer/stores/app";
import { useSocketStore } from "@/renderer/stores/socket";

export const HEADER_HEIGHT = 72;
export const ACTIONS_HEIGHT = 52;
const SERVER_STATUS_HEIGHT = 32;
export const BOTTOM_STATUS_BAR_HEIGHT = 64;

export const LAYOUT_TOP_HEIGHT =
  HEADER_HEIGHT + ACTIONS_HEIGHT;

export const LAYOUT_TOP_HEIGHT_FLOWCHART = LAYOUT_TOP_HEIGHT + SERVER_STATUS_HEIGHT + 32; 

export const Layout = () => {
  const serverStatus = useSocketStore((state) => state.serverStatus);

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
      <div className="relative bg-background px-8 py-2">
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
