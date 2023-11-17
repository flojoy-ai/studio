import { cn } from "@src/lib/utils";
import { Link, useLocation } from "react-router-dom";

type TabButtonProps = {
  to: string;
  children?: React.ReactNode;
  testId?: string;
};

const HeaderTab = ({ to, children, testId }: TabButtonProps) => {
  const location = useLocation();

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
      >
        {children}
      </Link>
    </div>
  );
};

export default HeaderTab;
