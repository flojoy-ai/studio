import { useFlowChartState } from "@hooks/useFlowChartState";
import HandleComponent from "@feature/flow_chart_panel/components/HandleComponent";
import { CustomNodeProps } from "@feature/flow_chart_panel/types/CustomNodeProps";
import NodeWrapper from "../NodeWrapper";
import { Box, clsx, createStyles } from "@mantine/core";
import { useNodeStyles } from "../DefaultNode";
import { ScipySvg } from "@src/assets/ArithmeticSVG";

const useStyles = createStyles((theme) => {
  const accent =
    theme.colorScheme === "light"
      ? theme.colors.accent6[0]
      : theme.colors.accent6[0];
  return {
    scipyNode: {
      width: 180,
      height: 130,
      borderRadius: 6,
      flexDirection: "column",
      justifyContent: "center",
      border: `1px solid ${accent}`,
      color: accent,
      backgroundColor: accent + "27",
    },
    operatorIcon: {
      position: "absolute",
      right: 8,
      bottom: 5,
      height: 40,
      width: 40,
    },
  };
});

const ScipyNode = ({ data, handleRemove }: CustomNodeProps) => {
  const nodeClasses = useNodeStyles().classes;
  const { classes } = useStyles();
  const { runningNode, failedNode } = useFlowChartState();
  const params = data.inputs ?? [];

  let selectShadow = "";
  if (runningNode === data.id || data.selected) {
    selectShadow = nodeClasses.scipyShadow;
  }
  const operatorIcon = <ScipySvg className={classes.operatorIcon} />;
  return (
    <NodeWrapper data={data} handleRemove={handleRemove}>
      <Box
        className={clsx(
          selectShadow,
          failedNode === data.id ? nodeClasses.failShadow : ""
        )}
      >
        <Box
          className={clsx(nodeClasses.nodeContainer, classes.scipyNode)}
          sx={{
            ...(params.length > 0 && { padding: "0px 0px 8px 0px" }),
          }}
        >
          <Box data-testid="data-label-design">
            <Box>{data.label}</Box>
          </Box>
          {/* <AddBGTemplate /> */}
          {operatorIcon}
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

export default ScipyNode;
