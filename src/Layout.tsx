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
      {/* The ServerStatus takes 30px */}
      <ServerStatus serverStatus={serverStatus} />
      {/* The ServerStatus takes 70px */}
      <Header />
      <main style={{ minHeight: "calc(100vh - 100px)" }}>{children}</main>
    </div>
  );
};
