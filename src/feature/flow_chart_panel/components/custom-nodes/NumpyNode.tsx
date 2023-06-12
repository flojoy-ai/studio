import { useFlowChartState } from "@hooks/useFlowChartState";
import HandleComponent from "@feature/flow_chart_panel/components/HandleComponent";
import { CustomNodeProps } from "@feature/flow_chart_panel/types/CustomNodeProps";
import NodeWrapper from "../NodeWrapper";
import { Box, clsx, createStyles } from "@mantine/core";
import { useNodeStyles } from "../DefaultNode";
import { NumpySvg } from "../../svgs/add-multiply-svg";
const useStyles = createStyles((theme) => {
  const accent =
    theme.colorScheme === "light"
      ? theme.colors.accent7[0]
      : theme.colors.accent7[0];
  return {
    numpyNode: {
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
      right: -8,
      bottom: -8,
      height: 55,
      width: 55,
    },
  };
});

const NumpyNode = ({ data }: CustomNodeProps) => {
  const nodeClasses = useNodeStyles().classes;
  const { classes } = useStyles();
  const { runningNode, failedNode } = useFlowChartState();
  const params = data.inputs || [];

  let selectShadow = "";
  if (runningNode === data.id || data.selected) {
    selectShadow = nodeClasses.numpyShadow;
  }
  const operatorIcon = <NumpySvg className={classes.operatorIcon} />;
  return (
    <NodeWrapper data={data}>
      <Box
        className={clsx(
          selectShadow,
          failedNode === data.id ? nodeClasses.failShadow : ""
        )}
      >
        <Box
          className={clsx(nodeClasses.nodeContainer, classes.numpyNode)}
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
            <HandleComponent data={data} inputs={params} />
          </Box>
        </Box>
      </Box>
    </NodeWrapper>
  );
};

export default NumpyNode;
