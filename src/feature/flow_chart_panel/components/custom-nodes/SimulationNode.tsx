import { useFlowChartState } from "@hooks/useFlowChartState";
import HandleComponent from "@feature/flow_chart_panel/components/HandleComponent";
import {
  CustomNodeProps,
  ElementsData,
} from "@feature/flow_chart_panel/types/CustomNodeProps";
import { useEffect } from "react";
import NodeWrapper from "../NodeWrapper";
import NodeEditButtons from "../node-edit-menu/NodeEditButtons";
import { Box, clsx, createStyles, useMantineColorScheme } from "@mantine/core";
import { useNodeStyles } from "../DefaultNode";

const useStyles = createStyles((theme) => {
  const accent =
    theme.colorScheme === "light"
      ? theme.colors.accent1[0]
      : theme.colors.accent2[0];
  return {
    simulationNode: {
      width: 115,
      borderRadius: 6,
      flexDirection: "column",
      justifyContent: "center",
      border: `1px solid ${accent}`,
      color: accent,
      backgroundColor: accent + "27",
      textAlign: "center",
      overflowWrap: "anywhere",
      inlineSize: 115
    },
  };
});

const SimulationNode = ({ data }: CustomNodeProps) => {
  const nodeClasses = useNodeStyles().classes;
  const { classes } = useStyles();
  const { runningNode, failedNode, nodes, setNodes } = useFlowChartState();
  const params = data.inputs || [];

  useEffect(() => {
    setNodes((prev) => {
      const selectedNode = prev.find((n) => n.id === data.id);
      if (selectedNode) {
        selectedNode.data.selected = selectedNode.selected;
      }
    });
  }, [data, nodes, setNodes]);

  let selectShadow = "";
  if (runningNode === data.id || data.selected) {
    selectShadow =
      data.func === "LINSPACE"
        ? nodeClasses.defaultShadow
        : nodeClasses.simulationShadow;
  }

  return (
    <NodeWrapper data={data}>
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
          {data.selected && Object.keys(data.ctrls).length > 0 && (
            <NodeEditButtons />
          )}
          <Box data-testid="data-label-design">
            <Box>{data.label}</Box>
          </Box>
          <Box
            display="flex"
            h={params.length > 0 ? (params.length + 1) * 40 : "fit-content"}
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

export default SimulationNode;
