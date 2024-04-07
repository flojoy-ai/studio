import Header from "./Header";
import { Outlet } from "react-router-dom";
import StatusBar from "@/renderer/routes/common/StatusBar";

export const HEADER_HEIGHT = 72;
export const ACTIONS_HEIGHT = 52;
export const BOTTOM_STATUS_BAR_HEIGHT = 64;

export const LAYOUT_TOP_HEIGHT = HEADER_HEIGHT + ACTIONS_HEIGHT;

export const LAYOUT_TOP_HEIGHT_FLOWCHART = LAYOUT_TOP_HEIGHT;

export const Layout = () => {
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
