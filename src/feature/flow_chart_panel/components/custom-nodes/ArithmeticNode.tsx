import HandleComponent from "@feature/flow_chart_panel/components/HandleComponent";
import { CustomNodeProps } from "@feature/flow_chart_panel/types/CustomNodeProps";
import { useFlowChartState } from "@hooks/useFlowChartState";
import { Box, clsx, createStyles } from "@mantine/core";
import { memo } from "react";
import {
  AddBGTemplate,
  AddSvg,
  MultiplySvg,
  SubSvg,
} from "../../svgs/add-multiply-svg";
import { useNodeStyles } from "../DefaultNode";
import NodeWrapper from "../NodeWrapper";

const useStyles = createStyles((theme) => {
  return {
    arithmeticNode: {
      color:
        theme.colorScheme === "light"
          ? theme.colors.accent1[0]
          : theme.colors.accent2[0],
      background: "transparent",
    },
    operatorIcon: {
      position: "absolute",
      left: 29,
      height: 20,
      width: 20,
    },
  };
});

const ArithmeticNode = ({ data }: CustomNodeProps) => {
  const nodeClasses = useNodeStyles().classes;
  const { classes } = useStyles();
  const { runningNode, failedNode } = useFlowChartState();
  const params = data.inputs || [];

  let operatorIcon: JSX.Element;
  switch (data.func) {
    case "MULTIPLY":
      operatorIcon = <MultiplySvg className={classes.operatorIcon} />;
      break;
    case "ADD":
      operatorIcon = <AddSvg className={classes.operatorIcon} />;
      break;
    case "SUBTRACT":
      operatorIcon = <SubSvg className={classes.operatorIcon} />;
      break;
    default:
      operatorIcon = <Box />;
  }

  return (
    <NodeWrapper data={data}>
      <Box
        className={clsx(
          runningNode === data.id || data.selected
            ? nodeClasses.arithmeticShadow
            : "",
          failedNode === data.id ? nodeClasses.failShadow : ""
        )}
      >
        <Box
          className={clsx(nodeClasses.nodeContainer, classes.arithmeticNode)}
          sx={{
            ...(params.length > 0 && { padding: "0px 0px 8px 0px" }),
          }}
        >
          <AddBGTemplate />
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

export default memo(ArithmeticNode);
