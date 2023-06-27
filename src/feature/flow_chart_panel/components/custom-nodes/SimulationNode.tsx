import HandleComponent from "@feature/flow_chart_panel/components/HandleComponent";
import { CustomNodeProps } from "@feature/flow_chart_panel/types/CustomNodeProps";
import { useFlowChartState } from "@hooks/useFlowChartState";
import { Text, Box, clsx, createStyles } from "@mantine/core";
import { memo } from "react";
import { useNodeStyles } from "../DefaultNode";
import NodeWrapper from "../NodeWrapper";

const useStyles = createStyles((theme) => {
  const accent =
    theme.colorScheme === "light"
      ? theme.colors.accent1[0]
      : theme.colors.accent2[0];
  return {
    simulationNode: {
      width: 130,
      borderRadius: 6,
      flexDirection: "column",
      justifyContent: "center",
      border: `1px solid ${accent}`,
      color: accent,
      backgroundColor: accent + "27",
      textAlign: "center",
      overflowWrap: "anywhere",
      padding: "16px",
    },
  };
});

const SimulationNode = ({ data, handleRemove }: CustomNodeProps) => {
  const nodeClasses = useNodeStyles().classes;
  const { classes } = useStyles();
  const { runningNode, failedNode } = useFlowChartState();
  const params = data.inputs ?? [];

  let selectShadow = "";
  if (runningNode === data.id || data.selected) {
    selectShadow =
      data.func === "LINSPACE"
        ? nodeClasses.defaultShadow
        : nodeClasses.simulationShadow;
  }

  return (
    <NodeWrapper data={data} handleRemove={handleRemove}>
      <Box
        className={clsx(
          selectShadow,
          failedNode === data.id ? nodeClasses.failShadow : ""
        )}
      >
        <Box
          className={clsx(nodeClasses.nodeContainer, classes.simulationNode)}
          sx={{
            ...(params.length > 0 && { padding: "0px 0px 8px 0px" }),
          }}
        >
          <Box data-testid="data-label-design">
            <Text
              weight={600}
              size="xl"
              sx={{ letterSpacing: 1, fontFamily: "Open Sans" }}
            >
              {data.label}
            </Text>
          </Box>
          <Box
            display="flex"
            h={params.length > 0 ? (params.length + 1) * 40 : "fit-content"}
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

export default memo(SimulationNode);
