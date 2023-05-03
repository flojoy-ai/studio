import React, { useEffect, useState } from "react";
import { CustomNodeProps } from "../../types/CustomNodeProps";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import HandleComponent from "../HandleComponent";
import "./node-wrapper.css";
import { useSocket } from "@src/hooks/useSocket";

const NodeWrapper = ({
  data,
  children,
}: CustomNodeProps & {
  children: React.ReactNode;
}) => {
  const { failedNode } = useFlowChartState();
  const { states } = useSocket();
  const [runError, setRunError] = useState<{
    message: string;
    show: boolean;
  } | null>(null);

  const handleMouseEnter = () => {
    if (runError) {
      setRunError((p) => ({ ...p!, show: true }));
    }
  };
  const handleMouseLeave = () => {
    if (runError) {
      setRunError((p) => ({ ...p!, show: false }));
    }
  };

  useEffect(() => {
    if (failedNode === data.id) {
      setRunError({
        message: states?.failureReason!,
        show: false,
      });
    }
    return () => {
      setRunError(null);
    };
  }, [failedNode, data, states?.failureReason]);
  return (
    <div
      data-testid="node-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {runError?.show && <ErrorPopup message={runError.message} />}
      {children}
    </div>
  );
};

export default NodeWrapper;

const ErrorPopup = ({ message }: { message: string }) => {
  return (
    <div
      className="error__popup__container"
      data-testid="node-error-popup"
      style={{ top: "-50px" }}
    >
      <div className="message">{message}</div>
      <div className="error__popup__arrow"></div>
    </div>
  );
};
