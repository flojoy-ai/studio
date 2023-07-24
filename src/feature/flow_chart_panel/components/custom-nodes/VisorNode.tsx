import HandleComponent from "@feature/flow_chart_panel/components/HandleComponent";
import { CustomNodeProps } from "@feature/flow_chart_panel/types/CustomNodeProps";
import { useFlowChartState } from "@hooks/useFlowChartState";
import { Box, clsx, createStyles, useMantineTheme } from "@mantine/core";
import PlotlyComponent from "@src/feature/common/PlotlyComponent";
import { useSocket } from "@src/hooks/useSocket";
import { makePlotlyData } from "@src/utils/FormatPlotlyData";
import { memo, useMemo, JSX } from "react";
import { useNodeStyles } from "../DefaultNode";
import Scatter3D from "@src/assets/nodes/3DScatter";
import Surface3D from "@src/assets/nodes/3DSurface";
import BarChart from "@src/assets/nodes/Bar";
import BigNumber from "@src/assets/nodes/BigNumber";
import BoxPlot from "@src/assets/nodes/BoxPlot";
import Histogram from "@src/assets/nodes/Histogram";
import PlotlyImage from "@src/assets/nodes/Image";
import LineChart from "@src/assets/nodes/LineChart";
import Scatter from "@src/assets/nodes/Scatter";
import PlotlyTable from "@src/assets/nodes/Table";
import NodeWrapper from "../NodeWrapper";
import ArrayView from "@src/assets/nodes/ArrayView";
import ProphetPlot from "@src/assets/nodes/ProphetPlot";
import ProphetComponents from "@src/assets/nodes/ProphetComponents";
import CompositePlot from "@src/assets/nodes/CompositePlot";
import MatrixView from "@src/assets/nodes/MatrixView";
import { twMerge } from "tailwind-merge";

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
  const theme = useMantineTheme();
  const { runningNode, failedNode } = useFlowChartState();

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
    [result, theme]
  );

  return (
    <NodeWrapper data={data} handleRemove={handleRemove}>
      <Box
        className={clsx(
          "rounded-xl",
          data.id === runningNode || data.selected
            ? "shadow-around shadow-accent1"
            : "",
          data.id === failedNode ? "shadow-around shadow-red-700" : ""
        )}
      >
        {result && plotlyResultData ? (
          <div>
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

            <HandleComponent data={data} colorClass="!border-accent1" />
          </div>
        ) : (
          <div>
            {chartElemMap[data.func]}
            <HandleComponent data={data} colorClass="!border-accent1" />
          </div>
        )}
      </Box>
    </NodeWrapper>
  );
};

export default memo(VisorNode);
