import { useFlowChartState } from "@hooks/useFlowChartState";
import { Box, clsx, createStyles } from "@mantine/core";
import HandleComponent from "@src/feature/flow_chart_panel/components/HandleComponent";
import NodeWrapper from "@src/feature/flow_chart_panel/components/NodeWrapper";
import { CustomNodeProps } from "@src/feature/flow_chart_panel/types/CustomNodeProps";
import { memo } from "react";
import { useNodeStyles } from "../DefaultNode";
import { NodeLabel } from "../NodeLabel";

const useStyles = createStyles((theme) => {
  return {
    terminatorNode: {
      backgroundColor: theme.colors.red[7] + "30",
    },
  };
});

const TerminatorNode = ({ data, handleRemove }: CustomNodeProps) => {
  const nodeClasses = useNodeStyles().classes;
  const { classes } = useStyles();
  const { runningNode, failedNode } = useFlowChartState();
  const params = data.inputs || [];

  return (
    <NodeWrapper data={data} handleRemove={handleRemove}>
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
          <NodeLabel label={data.label} />
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

export default memo(TerminatorNode);
