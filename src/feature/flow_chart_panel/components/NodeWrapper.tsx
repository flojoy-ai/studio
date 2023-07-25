import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { useSocket } from "@src/hooks/useSocket";
import React, { useEffect, useState } from "react";
import { CustomNodeProps } from "../types/CustomNodeProps";
import NodeButtons from "./node-edit-menu/NodeButtons";

const NodeWrapper = ({
  data,
  handleRemove,
  children,
}: CustomNodeProps & {
  children: React.ReactNode;
}) => {
  const { setIsEditMode, setIsExpandMode } = useFlowChartState();
  const { failedNode } = useFlowChartState();
  const { states } = useSocket();
  const [runError, setRunError] = useState<{
    message: string;
    show: boolean;
  } | null>(null);

  useEffect(() => {
    if (failedNode === data.id) {
      setRunError({
        message: states?.failureReason ?? "Unknown failure reason",
        show: false,
      });
    }
    return () => {
      setRunError(null);
    };
  }, [failedNode, data.id, states?.failureReason]);

  return (
    <div
      data-testid="node-wrapper"
      className="relative"
      onClick={() => setIsEditMode(true)}
    >
      {data.selected && (
        <NodeButtons
          data={data}
          handleRemove={handleRemove}
          setIsExpandMode={setIsExpandMode}
        />
      )}
      {runError && <ErrorPopup message={runError.message} />}
      {children}
    </div>
  );
};

export default NodeWrapper;

const ErrorPopup = ({ message }: { message: string }) => {
  return (
    <div
      className="absolute -top-14 left-1/2 right-1/2 z-50 my-3 w-max max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-red-400 p-3 font-semibold"
      data-testid="node-error-popup"
    >
      <p className="text-lg text-gray-900 dark:text-gray-50">{message}</p>
      <div className="absolute -bottom-2 left-1/2 -ml-2 h-0 w-0 border-x-8 border-t-8 border-x-transparent border-t-red-400" />
    </div>
  );
};
