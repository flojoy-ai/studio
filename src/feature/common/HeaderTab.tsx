import { cn } from "@src/lib/utils";
import { Link } from "react-router-dom";

type TabButtonProps = {
  to: string;
  children?: React.ReactNode;
  testId?: string;
};

const HeaderTab = ({ to, children, testId }: TabButtonProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "inline-block cursor-pointer border-b-2 border-b-accent1 bg-transparent py-6 !font-sans text-sm font-semibold uppercase tracking-[1px]",
      )}
      data-cy={testId}
    >
      {children}
    </Link>
  );
};

export default HeaderTab;
