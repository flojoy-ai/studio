import { Header } from "./Header";

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <Header />
      <main style={{ minHeight: "85vh" }}>{children}</main>
    </div>
  );
};
