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
  const { failedNode, setNodes, nodes } = useFlowChartState();
  const { states } = useSocket();
  const { failureReason } = states!;
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
        message: failureReason,
        show: false,
      });
    }
    return () => {
      setRunError(null);
    };
  }, [failedNode, data]);
  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {runError?.show && <ErrorPopup message={failureReason} />}
      {children}
    </div>
  );
};

export default NodeWrapper;

const ErrorPopup = ({ message }: { message: string }) => {
  return (
    <div className="error__popup__container" style={{ top: "-50px" }}>
      <div className="message">{message}</div>
      <div className="error__popup__arrow"></div>
    </div>
  );
};
