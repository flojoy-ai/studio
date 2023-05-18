import React, { useEffect, useRef, useState } from "react";
import { CustomNodeProps } from "../types/CustomNodeProps";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { useSocket } from "@src/hooks/useSocket";
import { Box, createStyles, Text } from "@mantine/core";
import NodeEditButtons from "./node-edit-menu/NodeEditButtons";

const NodeWrapper = ({
  data,
  children,
}: CustomNodeProps & {
  children: React.ReactNode;
}) => {
  const { failedNode, setNodes, setEdges } = useFlowChartState();
  const { states } = useSocket();
  const [runError, setRunError] = useState<{
    message: string;
    show: boolean;
  } | null>(null);

  const handleNodeRemove = (nodeId: string) => {
    setNodes((prev) => prev.filter((node) => node.id !== nodeId));
    setEdges((prev) =>
      prev.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );
  };

  useEffect(() => {
    console.log("15");
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
    <div data-testid="node-wrapper">
      {runError && <ErrorPopup message={runError.message} />}
      {data.selected && (
        <NodeEditButtons
          showPencil={Object.keys(data.ctrls).length > 0}
          data={data}
          handleRemove={handleNodeRemove}
        />
      )}
      {children}
    </div>
  );
};

export default NodeWrapper;

const useStyles = createStyles((theme) => {
  return {
    popupContainer: {
      position: "absolute",
      top: -50,
      left: "50%",
      right: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#dcf8c6",
      borderRadius: theme.radius.sm,
      margin: "10px 0",
      padding: 10,
      width: "max-content",
      maxWidth: 500,
      zIndex: 100,
      color: theme.black,
      fontWeight: 600,
    },
    popupArrow: {
      borderStyle: "solid",
      borderWidth: "10px 10px 0 10px",
      borderColor: "#dcf8c6 transparent transparent transparent",
      height: 0,
      width: 0,
      position: "absolute",
      bottom: -10,
      left: "50%",
      marginLeft: -10,
    },
  };
});

const ErrorPopup = ({ message }: { message: string }) => {
  const { classes } = useStyles();
  return (
    <Box className={classes.popupContainer} data-testid="node-error-popup">
      <Text fz="lg">{message}</Text>
      <Box className={classes.popupArrow} />
    </Box>
  );
};
