import clsx from "clsx";
import React from "react";
import { type CSSProperties } from "react";

const BlockWrapper = ({
  children,
  style,
  className,
}: {
  children: React.ReactNode;
  style?: CSSProperties;
  className?: string;
}) => {
  return (
    <div
      className={clsx("relative", className)}
      data-testid="node-wrapper"
      style={style}
    >
      {children}
    </div>
  );
};

export default BlockWrapper;
