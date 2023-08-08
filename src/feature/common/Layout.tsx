import Header from "./Header";
import { useSocket } from "@src/hooks/useSocket";
import { HEADER_HEIGHT } from "./Header";
import { ACTIONS_HEIGHT } from "../flow_chart_panel/FlowChartTabView";

type LayoutProps = {
  children: React.ReactNode;
};

const SERVER_STATUS_HEIGHT = 30;

export const LAYOUT_TOP_HEIGHT =
  HEADER_HEIGHT + ACTIONS_HEIGHT + SERVER_STATUS_HEIGHT;

export const Layout = ({ children }: LayoutProps) => {
  const {
    states: { serverStatus },
  } = useSocket();

  return (
    <div>
      <div className="sm:px-8">
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
        <Header />
      </div>
      <main style={{ minHeight: `calc(100vh - ${LAYOUT_TOP_HEIGHT}px)` }}>
        {children}
      </main>
    </div>
  );
};
