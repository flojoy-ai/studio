import clsx from "clsx";

type NodeWrapperProps = {
  children: React.ReactNode;
  className?: string;
};

const NodeWrapper = ({ children, className }: NodeWrapperProps) => {
  return (
    <div className={clsx("relative", className)} data-testid="node-wrapper">
      {children}
    </div>
  );
};

export default NodeWrapper;
