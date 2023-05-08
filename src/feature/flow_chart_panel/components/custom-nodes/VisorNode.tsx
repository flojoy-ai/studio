import HandleComponent from "@feature/flow_chart_panel/components/HandleComponent";
import { CustomNodeProps } from "@feature/flow_chart_panel/types/CustomNodeProps";
import { useFlowChartState } from "@hooks/useFlowChartState";
import { Box, clsx, createStyles, useMantineColorScheme } from "@mantine/core";
import { useEffect } from "react";
import { BGTemplate } from "../../svgs/histo-scatter-svg";
import { useNodeStyles } from "../DefaultNode";
import NodeWrapper from "../NodeWrapper";
import Scatter3D from "../nodes/3d-scatter";
import Surface3D from "../nodes/3d-surface";
import Histogram from "../nodes/Histogram";
import Scatter from "../nodes/Scatter";
import BarChart from "../nodes/bar";
import LineChart from "../nodes/line-chart";

const useStyles = createStyles((theme) => {
  return {
    visorNode: {
      background: "transparent",
      color:
        theme.colorScheme === "light"
          ? theme.colors.accent1[0]
          : theme.colors.accent2[0],
    },
  };
});

const chartElemMap: { [func: string]: JSX.Element } = {
  SCATTER: <Scatter />,
  HISTOGRAM: <Histogram />,
  LINE: <LineChart />,
  SURFACE3D: <Surface3D />,
  SCATTER3D: <Scatter3D />,
  BAR: <BarChart />,
};

const VisorNode = ({ data }: CustomNodeProps) => {
  const nodeClasses = useNodeStyles().classes;
  const { classes } = useStyles();
  const { colorScheme } = useMantineColorScheme();
  const { runningNode, failedNode, nodes, setNodes } = useFlowChartState();
  const params = data.inputs || [];

  useEffect(() => {
    setNodes((prev) => {
      const selectedNode = prev.find((n) => n.id === data.id);
      if (selectedNode) {
        selectedNode.data.selected = selectedNode.selected;
      }
      return prev;
    });
  }, [data, nodes, setNodes]);

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
          className={clsx(classes.visorNode, nodeClasses.nodeContainer)}
          style={{
            ...(params.length > 0 && { padding: "0px 0px 8px 0px" }),
          }}
        >
          {chartElemMap[data.func]}
          <BGTemplate theme={colorScheme} />
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

export default VisorNode;
