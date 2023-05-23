import HandleComponent from "@feature/flow_chart_panel/components/HandleComponent";
import { CustomNodeProps } from "@feature/flow_chart_panel/types/CustomNodeProps";
import { useFlowChartState } from "@hooks/useFlowChartState";
import { Box, clsx, createStyles, useMantineTheme } from "@mantine/core";
import PlotlyComponent from "@src/feature/common/PlotlyComponent";
import { useSocket } from "@src/hooks/useSocket";
import { useEffect } from "react";
import { useNodeStyles } from "../DefaultNode";
import NodeWrapper from "../NodeWrapper";
import Scatter3D from "../nodes/3d-scatter";
import Surface3D from "../nodes/3d-surface";
import Histogram from "../nodes/Histogram";
import Scatter from "../nodes/Scatter";
import BarChart from "../nodes/bar";
import LineChart from "../nodes/line-chart";
import { makePlotlyData } from "@src/utils/format_plotly_data";
import PlotlyTable from "../nodes/Table";
import PlotlyImage from "../nodes/Image";
import BoxPlot from "../nodes/box-plot";
import BigNumber from "../nodes/BigNumber";

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
  TABLE: <PlotlyTable />,
  IMAGE: <PlotlyImage />,
  BOX: <BoxPlot />,
  BIG_NUMBER: <BigNumber />,
};

const VisorNode = ({ data }: CustomNodeProps) => {
  const nodeClasses = useNodeStyles().classes;
  const { classes } = useStyles();
  const theme = useMantineTheme();
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

  const { states } = useSocket();
  const { programResults } = states!;
  const results = programResults?.io;
  const result = results?.find((r) => r.id === data.id);

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
        {result ? (
          <>
            <PlotlyComponent
              data={makePlotlyData(result.result.default_fig.data, theme, true)}
              id={data.id}
              layout={result.result.default_fig.layout ?? {}}
              useResizeHandler
              style={{
                height: 190,
                width: 210,
              }}
              isThumbnail
            />

            <Box
              display="flex"
              h={params.length > 0 ? (params.length + 1) * 40 : "fit-content"}
              sx={{
                flexDirection: "column",
              }}
            >
              <HandleComponent data={data} inputs={params} />
            </Box>
          </>
        ) : (
          <Box
            className={clsx(classes.visorNode, nodeClasses.nodeContainer)}
            style={{
              ...(params.length > 0 && { padding: "0px 0px 8px 0px" }),
            }}
          >
            {chartElemMap[data.func]}
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
        )}
      </Box>
    </NodeWrapper>
  );
};

export default VisorNode;
