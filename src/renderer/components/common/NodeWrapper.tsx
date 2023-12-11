import { CustomNodeProps } from "@src/types";
import clsx from "clsx";
import React from "react";
import HandleComponent from "./HandleComponent";
import { CSSProperties } from "react";
import { cn } from "@src/lib/utils";

const NodeWrapper = ({
  selected,
  nodeError,
  children,
  data,
  style,
  className,
}: {
  selected: boolean;
  nodeError: string;
  children: React.ReactNode;
  data: CustomNodeProps["data"];
  style?: CSSProperties;
  className?: string;
}) => {
  if (data.invalid) {
    return (
      <div
        className={clsx(
          "flex min-h-[160px] items-center justify-center break-words rounded-2xl border-2 border-solid border-red-400 bg-red-400/20",
          { "shadow-around shadow-red-500": selected },
        )}
      >
        <div>
          <div className="text-center text-3xl font-extrabold tracking-widest text-red-400">
            ???
          </div>
          <div className="py-0.5" />
          <h2 className="m-0 mb-6 text-center font-sans text-2xl font-extrabold tracking-wider text-red-400">
            UNKNOWN
          </h2>
        </div>
        <HandleComponent data={data} variant="red" />
      </div>
    );
  }
  return (
    <div
      className={cn("relative", className)}
      data-testid="node-wrapper"
      style={style}
    >
      {nodeError && <ErrorPopup message={nodeError} />}
      {children}
    </div>
  );
};

export default NodeWrapper;

const ErrorPopup = ({ message }: { message: string }) => {
  return (
    <div
      className="absolute -top-14 left-1/2 right-1/2 z-50 my-3 w-max max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-solid border-red-400 p-3 font-semibold"
      data-testid="node-error-popup"
    >
      <p className="m-0 font-sans text-lg text-gray-900 dark:text-gray-50">
        {message}
      </p>
      <div className="absolute -bottom-3 left-1/2 -ml-2 h-0 w-0 border-x-8 border-t-8 border-solid border-x-transparent border-t-red-400" />
    </div>
  );
};
