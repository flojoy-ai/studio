import { CustomNodeProps } from "@src/types/node";
import NodeWrapper from "@src/components/common/NodeWrapper";
import clsx from "clsx";
import HandleComponent from "@src/components/common/HandleComponent";
import Scatter from "@src/assets/nodes/Scatter";
import { memo, useMemo } from "react";
import { makePlotlyData } from "@src/components/plotly/formatPlotlyData";
import PlotlyComponent from "@src/components/plotly/PlotlyComponent";
import CompositePlot from "@src/assets/nodes/CompositePlot";
import ProphetComponents from "@src/assets/nodes/ProphetComponents";
import ProphetPlot from "@src/assets/nodes/ProphetPlot";
import ArrayView from "@src/assets/nodes/ArrayView";
import MatrixView from "@src/assets/nodes/MatrixView";
import BigNumber from "@src/assets/nodes/BigNumber";
import BoxPlot from "@src/assets/nodes/BoxPlot";
import Histogram from "@src/assets/nodes/Histogram";
import LineChart from "@src/assets/nodes/LineChart";
import Scatter3D from "@src/assets/nodes/3DScatter";
import Surface3D from "@src/assets/nodes/3DSurface";
import Bar from "@src/assets/nodes/Bar";
import Table from "@src/assets/nodes/Table";
import Image from "@src/assets/nodes/Image";
import MarkDownText from "@src/components/common/MarkDownText";
import { useTheme } from "@src/providers/themeProvider";
import PeakFinder from "@src/assets/nodes/PeakFinder";
import RegionInspector from "@src/assets/nodes/RegionInspector";
import TextView from "@src/assets/nodes/TextView";
import Heatmap from "@src/assets/nodes/Heatmap";

const chartElemMap: { [func: string]: React.JSX.Element } = {
  SCATTER: <Scatter />,
  HISTOGRAM: <Histogram />,
  LINE: <LineChart />,
  SURFACE3D: <Surface3D />,
  SCATTER3D: <Scatter3D />,
  BAR: <Bar />,
  TABLE: <Table />,
  IMAGE: <Image />,
  BOX: <BoxPlot />,
  BIG_NUMBER: <BigNumber />,
  MATRIX_VIEW: <MatrixView />,
  ARRAY_VIEW: <ArrayView />,
  PROPHET_PLOT: <ProphetPlot />,
  PROPHET_COMPONENTS: <ProphetComponents />,
  COMPOSITE: <CompositePlot />,
  TEXT_VIEW: <TextView />,
  EXTREMA_DETERMINATION: <PeakFinder />,
  REGION_PROPERTIES: <RegionInspector />,
  HEATMAP: <Heatmap />,
};

const VisorNode = (props: CustomNodeProps) => {
  const {
    nodeProps: { data },
    nodeError,
    isRunning,
    plotlyFig,
    textBlob,
  } = props;

  const { resolvedTheme } = useTheme();

  const plotlyData = useMemo(
    () =>
      plotlyFig ? makePlotlyData(plotlyFig.data, resolvedTheme, true) : null,
    [plotlyFig, resolvedTheme],
  );

  return (
    <NodeWrapper wrapperProps={props}>
      <div
        className={clsx(
          "rounded-2xl bg-transparent",
          { "shadow-around shadow-accent2": isRunning || data.selected },
          { "shadow-around shadow-red-700": nodeError },
        )}
      >
        {plotlyData && (
          <PlotlyComponent
            data={plotlyData}
            id={data.id}
            layout={plotlyFig?.layout ?? {}}
            useResizeHandler
            style={{
              height: 293,
              width: 380,
            }}
            isThumbnail
          />
        )}
        {textBlob && <MarkDownText text={textBlob} isThumbnail />}
        {!plotlyData && !textBlob && <>{chartElemMap[data.func]}</>}
        <HandleComponent data={data} variant="accent2" />
      </div>
    </NodeWrapper>
  );
};

export default memo(VisorNode);
