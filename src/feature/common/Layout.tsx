import Header from "./Header";
import { useSocket } from "@src/hooks/useSocket";

type LayoutProps = {
  children: React.ReactNode;
};

export const HEADER_HEIGHT = 72;
export const ACTIONS_HEIGHT = 56;
const SERVER_STATUS_HEIGHT = 32;

export const LAYOUT_TOP_HEIGHT =
  HEADER_HEIGHT + ACTIONS_HEIGHT + SERVER_STATUS_HEIGHT;

export const Layout = ({ children }: LayoutProps) => {
  const {
    states: { serverStatus },
  } = useSocket();

  return (
    <div className="mx-8">
      <div className="">
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
