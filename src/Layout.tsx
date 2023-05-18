import Header from "./Header";
import ServerStatus from "./ServerStatus";
import { useSocket } from "./hooks/useSocket";

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  const {
    states: { serverStatus },
  } = useSocket();

  return (
    <div>
      <ServerStatus serverStatus={serverStatus} />
      <Header />
      <main style={{ minHeight: "85vh" }}>{children}</main>
    </div>
  );
};
