import HandleComponent from "@feature/flow_chart_panel/components/HandleComponent";
import { CustomNodeProps } from "@feature/flow_chart_panel/types/CustomNodeProps";
import { useFlowChartState } from "@hooks/useFlowChartState";
import { Box, Text, clsx } from "@mantine/core";
import { memo } from "react";
import { useNodeStyles } from "../DefaultNode";
import { NodeLabel } from "../NodeLabel";
import NodeWrapper from "../NodeWrapper";

const ConditionalNode = ({ data, handleRemove }: CustomNodeProps) => {
  const { classes } = useNodeStyles();

  const { runningNode, failedNode } = useFlowChartState();
  const params = data.inputs ?? [];

  return (
    <NodeWrapper data={data} handleRemove={handleRemove}>
      <Box
        className={clsx(
          runningNode === data.id || data.selected ? classes.defaultShadow : "",
          failedNode === data.id ? classes.failShadow : ""
        )}
      >
        <Box
          className={clsx(classes.nodeContainer, classes.defaultNode)}
          style={{
            ...(params.length > 0 && { padding: "0px 0px 8px 0px" }),
          }}
        >
          <Box>
            <Box mt={25}>
              <NodeLabel label={data.label} />
            </Box>
            <Box>
              {data.func === "CONDITIONAL" && (
                <>
                  <Text
                    mt={20}
                    sx={{ textAlign: "center" }}
                    data-testid="conditional-operator-type"
                  >
                    x {data["ctrls"]["operator_type"]["value"]} y
                  </Text>
                </>
              )}
              {data.func === "TIMER" && (
                <Text data-testid="timer-value">
                  {data["ctrls"][`TIMER_${data.label}_sleep_time`]["value"]}s
                </Text>
              )}
            </Box>
          </Box>

          <Box
            display="flex"
            h={params.length > 0 ? (params.length + 1) * 32 : "fit-content"}
            sx={{
              flexDirection: "column",
            }}
          >
            <HandleComponent data={data} />
          </Box>
        </Box>
      </Box>
    </NodeWrapper>
  );
};

export default memo(ConditionalNode);
