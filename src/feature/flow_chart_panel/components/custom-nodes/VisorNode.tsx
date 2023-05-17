import HandleComponent from "@feature/flow_chart_panel/components/HandleComponent";
import { CustomNodeProps } from "@feature/flow_chart_panel/types/CustomNodeProps";
import { useFlowChartState } from "@hooks/useFlowChartState";
import { Box, clsx, createStyles, useMantineTheme } from "@mantine/core";
import PlotlyComponent from "@src/feature/common/PlotlyComponent";
import { useSocket } from "@src/hooks/useSocket";
import { Layout } from "plotly.js";
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
import usePlotLayout from "@src/feature/common/usePlotLayout";
import { useMemo } from "react";

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
  const theme = useMantineTheme();
  const { runningNode, failedNode, selectedNode } = useFlowChartState();
  const params = data.inputs || [];

  const selected = selectedNode ? selectedNode.id === data.id : false;

  // TODO: Investigate why this keeps making it rerender
  const { states } = useSocket();
  const { programResults } = states!;

  const results = programResults?.io;
  const result = results?.find((r) => r.id === data.id);

  const plotLayout = usePlotLayout();

  const accentColor =
    theme.colorScheme === "dark"
      ? theme.colors.accent1[0]
      : theme.colors.accent2[0];

  const layoutOverride: Partial<Layout> = {
    plot_bgcolor: "transparent",
    title: data.label,
    margin: { t: 30, r: 0, b: 0, l: 0 },
    grid: { rows: 0, columns: 0 },
    xaxis: { visible: false },
    yaxis: { visible: false },
    font: {
      color: accentColor,
    },
  };

  const plotlyResultData = useMemo(
    () =>
      result
        ? result.result.default_fig.data.map((d) => ({
            ...d,
            marker: {
              ...d.marker,
              color: accentColor,
            },
          }))
        : undefined,
    [result]
  );

  return (
    <NodeWrapper data={data}>
      <Box
        className={clsx(
          runningNode === data.id || selected ? nodeClasses.defaultShadow : "",
          failedNode === data.id ? nodeClasses.failShadow : ""
        )}
      >
        {result && plotlyResultData ? (
          <>
            <PlotlyComponent
              data={plotlyResultData}
              id={data.id}
              layout={{ ...plotLayout, ...layoutOverride }}
              useResizeHandler
              style={{
                height: 190,
                width: 210,
              }}
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
            <BGTemplate theme={theme.colorScheme} />
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
