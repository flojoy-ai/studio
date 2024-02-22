import { cn } from "@/renderer/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { useActiveTab } from "@/renderer/hooks/useActiveTab";

type TabButtonProps = {
  to: string;
  children?: React.ReactNode;
  testId?: string;
};

const HeaderTab = ({ to, tabName, children, testId }: TabButtonProps) => {
  const location = useLocation();
  const { activeTab, setActiveTab } = useActiveTab();

  return (
    <div
      className={cn(
        "relative",
        location.pathname === to
          ? "border-b-2 border-b-accent1"
          : "after:flex after:scale-x-0 after:border-b-2 after:border-b-accent1 after:transition-transform after:duration-300 after:ease-in-out after:content-[''] after:hover:scale-x-100",
      )}
    >
      <Link
        to={to}
        className={cn(
          "inline-block cursor-pointer bg-transparent py-6 !font-sans text-sm font-semibold uppercase tracking-[1px]",
        )}
        data-cy={testId}
        onClick={() => setActiveTab(tabName)}
      >
        {children}
      </Link>
    </div>
  );
};

export default HeaderTab;
