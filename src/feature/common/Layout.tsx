import Header from "./Header";
import ServerStatus from "./ServerStatus";
import { useSocket } from "@src/hooks/useSocket";

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  const {
    states: { serverStatus },
  } = useSocket();

  return (
    <div className="px-8">
      {/* The ServerStatus takes 32px in tailwind */}
      <ServerStatus serverStatus={serverStatus} />
      {/* The ServerStatus takes 70px */}
      <Header />
      <main style={{ minHeight: "calc(100vh - 150px)" }}>{children}</main>
    </div>
  );
};
