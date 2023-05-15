import { useFlowChartState } from "@hooks/useFlowChartState";
import HandleComponent from "@src/feature/flow_chart_panel/components/HandleComponent";
import { CustomNodeProps } from "@src/feature/flow_chart_panel/types/CustomNodeProps";
import { useEffect } from "react";
import NodeWrapper from "@src/feature/flow_chart_panel/components/NodeWrapper";
import { Box, clsx, createStyles, useMantineColorScheme } from "@mantine/core";
import { useNodeStyles } from "../DefaultNode";

const useStyles = createStyles((theme) => {
  return {
    terminatorNode: {
      backgroundColor: theme.colors.red[7] + "30",
    },
  };
});

const TerminatorNode = ({ data }: CustomNodeProps) => {
  const nodeClasses = useNodeStyles().classes;
  const { classes } = useStyles();
  const { runningNode, failedNode, setNodes, nodes } = useFlowChartState();
  const params = data.inputs || [];

  // TODO: Find a better way to keep track of selected state

  // useEffect(() => {
  //   console.log("20");
  //   setNodes((prev) => {
  //     const selectedNode = prev.find((n) => n.id === data.id);
  //     if (selectedNode) {
  //       selectedNode.data.selected = selectedNode.selected;
  //     }
  //   });
  // }, [data, nodes, setNodes]);

  return (
    <NodeWrapper data={data}>
      <Box
        className={clsx(
          runningNode === data.id || data.selected
            ? nodeClasses.defaultShadow
            : "",
          failedNode === data.id ? nodeClasses.failShadow : ""
        )}
      >
        <Box
          className={clsx(
            nodeClasses.defaultNode,
            nodeClasses.nodeContainer,
            classes.terminatorNode
          )}
          style={{
            ...(params.length > 0 && { padding: "0px 0px 8px 0px" }),
          }}
        >
          <Box>{data.label}</Box>
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

export default TerminatorNode;
