import HandleComponent from "@feature/flow_chart_panel/components/HandleComponent";
import { CustomNodeProps } from "@feature/flow_chart_panel/types/CustomNodeProps";
import { useFlowChartState } from "@hooks/useFlowChartState";
import { Box, Text, clsx } from "@mantine/core";
import { useSocket } from "@src/hooks/useSocket";
import { memo, useEffect, useState } from "react";
import { useNodeStyles } from "../DefaultNode";
import NodeWrapper from "../NodeWrapper";
import NodeEditButtons from "../node-edit-menu/NodeEditButtons";

const ConditionalNode = ({ data }: CustomNodeProps) => {
  const { classes } = useNodeStyles();
  const [additionalInfo, setAdditionalInfo] = useState({});

  const { runningNode, failedNode } = useFlowChartState();
  const params = data.inputs || [];

  const { states } = useSocket();
  const { programResults } = states!;

  const isLoopInfoExist = () => {
    const isExist = Object.keys(additionalInfo).find(
      (value, _) => value === data.id
    );
    return isExist && data.func === "LOOP";
  };

  const current_iteration = isLoopInfoExist()
    ? additionalInfo[data.id]["current_iteration"] || 0
    : 0;
  const total_iteration = isLoopInfoExist()
    ? data["ctrls"][`LOOP_${data.label}_iteration_count`]["value"] || 0
    : 0;

  useEffect(() => {
    console.log("18");
    if (programResults?.io?.length! > 0) {
      let programAdditionalInfo = {};

      const results = programResults?.io;
      results?.forEach((element) => {
        programAdditionalInfo = {
          ...programAdditionalInfo,
          [element.id]: element["additional_info"],
        };
      });

      setAdditionalInfo(programAdditionalInfo);
    }
  }, [programResults]);

  return (
    <NodeWrapper data={data}>
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
            <Box mt={25}>{data.label}</Box>
            <Box>
              {data.func === "CONDITIONAL" && (
                <>
                  {params?.length !== 0 ? (
                    <Text
                      mt={20}
                      sx={{ textAlign: "center" }}
                      data-testid="conditional-operator-type"
                    >
                      x {data["ctrls"]["operator_type"]["value"]} y
                    </Text>
                  ) : (
                    <>
                      {Object.keys(additionalInfo)
                        .filter((value) => value === data.id)
                        .map((_, index) => {
                          return (
                            <Text key={index + 1}>
                              status: {additionalInfo[data.id]["status"]}
                            </Text>
                          );
                        })}
                    </>
                  )}
                </>
              )}
              {data.func === "TIMER" && (
                <Text data-testid="timer-value">
                  {data["ctrls"][`TIMER_${data.label}_sleep_time`]["value"]}s
                </Text>
              )}
              {data.func === "LOOP" && (
                <Box data-testid="loop-info">
                  <p>{`${current_iteration}/${total_iteration}`}</p>
                </Box>
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
            <HandleComponent data={data} inputs={params} />
          </Box>
        </Box>
      </Box>
    </NodeWrapper>
  );
};

export default memo(ConditionalNode);
