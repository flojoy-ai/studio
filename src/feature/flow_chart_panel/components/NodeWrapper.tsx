import { Box, Text, createStyles } from "@mantine/core";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { useSocket } from "@src/hooks/useSocket";
import React, { useEffect, useState } from "react";
import { CustomNodeProps } from "../types/CustomNodeProps";
import NodeButtons from "./node-edit-menu/NodeButtons";

const NodeWrapper = ({
  data,
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
    console.log("15");
    if (failedNode === data.id) {
      setRunError({
        message: states?.failureReason ?? "Unknown failure reason",
        show: false,
      });
    }
    return () => {
      setRunError(null);
    };
  }, [failedNode, states?.failureReason]);

  return (
    <Box
      data-testid="node-wrapper"
      pos="relative"
      onClick={() => setIsEditMode(true)}
    >
      {data.selected && (
        <NodeButtons data={data} setIsExpandMode={setIsExpandMode} />
      )}
      {runError && <ErrorPopup message={runError.message} />}
      {children}
    </Box>
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
