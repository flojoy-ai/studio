import React, { useEffect, useRef, useState } from "react";
import { CustomNodeProps } from "../types/CustomNodeProps";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { useSocket } from "@src/hooks/useSocket";
import { Box, createStyles, Text } from "@mantine/core";

function useTraceUpdate(props) {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v];
      }
      return ps;
    }, {});
    if (Object.keys(changedProps).length > 0) {
      console.log("Changed props:", changedProps);
    }
    prev.current = props;
  });
}

const NodeWrapper = ({
  data,
  children,
}: CustomNodeProps & {
  children: React.ReactNode;
}) => {
  useTraceUpdate({ data, children });
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

  // console.log(`Rerendering ${data.id}`);

  return (
    <div
      data-testid="node-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {runError && <ErrorPopup message={runError.message} />}
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
