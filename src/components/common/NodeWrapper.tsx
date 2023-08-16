import React from "react";
import { CustomNodeProps } from "../../types/node";

const NodeWrapper = ({
  wrapperProps: { nodeError },
  children,
}: {
  wrapperProps: CustomNodeProps;
  children: React.ReactNode;
}) => {
  return (
    <div className="relative" data-testid="node-wrapper">
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
