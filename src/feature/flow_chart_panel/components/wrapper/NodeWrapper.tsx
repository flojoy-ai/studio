import { useFlowChartState } from "@src/hooks/useFlowChartState";
import React from "react";

const NodeWrapper = ({ children, data }) => {
  const { runningNode, failedNode } = useFlowChartState();
  return (
    <div
      style={{
        ...(runningNode === data.id && { boxShadow: "0 0 50px 15px #48abe0" }),
        ...(failedNode === data.id && {
          boxShadow: "rgb(183 0 0) 0px 0px 50px 15px",
        }),
      }}
    >
      {children}
    </div>
  );
};

export default NodeWrapper;
