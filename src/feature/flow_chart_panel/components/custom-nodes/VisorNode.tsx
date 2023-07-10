import HandleComponent from "@feature/flow_chart_panel/components/HandleComponent";
import { CustomNodeProps } from "@feature/flow_chart_panel/types/CustomNodeProps";
import { useFlowChartState } from "@hooks/useFlowChartState";
import { Box, clsx, createStyles, useMantineTheme } from "@mantine/core";
import PlotlyComponent from "@src/feature/common/PlotlyComponent";
import { useSocket } from "@src/hooks/useSocket";
import { makePlotlyData } from "@src/utils/FormatPlotlyData";
import { memo, useMemo, JSX } from "react";
import { useNodeStyles } from "../DefaultNode";
import Scatter3D from "../nodes/3DScatter";
import Surface3D from "../nodes/3DSurface";
import BarChart from "../nodes/Bar";
import BigNumber from "../nodes/BigNumber";
import BoxPlot from "../nodes/BoxPlot";
import Histogram from "../nodes/Histogram";
import PlotlyImage from "../nodes/Image";
import LineChart from "../nodes/LineChart";
import Scatter from "../nodes/Scatter";
import PlotlyTable from "../nodes/Table";
import NodeWrapper from "../NodeWrapper";
import ArrayView from "../nodes/ArrayView";
import ProphetPlot from "../nodes/ProphetPlot";
import ProphetComponents from "../nodes/ProphetComponents";
import CompositePlot from "../nodes/CompositePlot";
import MatrixView from "../nodes/MatrixView";

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
  MATRIX_VIEW: <MatrixView />,
  ARRAY_VIEW: <ArrayView />,
  PROPHET_PLOT: <ProphetPlot />,
  PROPHET_COMPONENTS: <ProphetComponents />,
  COMPOSITE: <CompositePlot />,
};

const VisorNode = ({ data, handleRemove }: CustomNodeProps) => {
  const nodeClasses = useNodeStyles().classes;
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const { runningNode, failedNode } = useFlowChartState();
  const params = data.inputs ?? [];

  const {
    states: { programResults },
  } = useSocket();

  const results = programResults?.io;
  const result = results?.find((r) => r.id === data.id);

  const plotlyResultData = useMemo(
    () =>
      result
        ? makePlotlyData(result.result.default_fig.data, theme, true)
        : undefined,
    [result, theme.colorScheme]
  );

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
        {result && plotlyResultData ? (
          <Box className={nodeClasses.nodeContainer}>
            <PlotlyComponent
              data={plotlyResultData}
              id={data.id}
              layout={result.result.default_fig.layout ?? {}}
              useResizeHandler
              style={{
                height: 293,
                width: 380,
              }}
              isThumbnail
            />

            <HandleComponent data={data} />
          </Box>
        ) : (
          <Box className={clsx(classes.visorNode, nodeClasses.nodeContainer)}>
            {chartElemMap[data.func]}
            <HandleComponent data={data} />
          </Box>
        )}
      </Box>
    </NodeWrapper>
  );
};

export default memo(VisorNode);
