import { CustomNodeProps } from "@src/types/node";
import NodeWrapper from "@/components/common/NodeWrapper";
import clsx from "clsx";
import HandleComponent from "@/components/common/HandleComponent";
import Scatter from "@/assets/nodes/Scatter";
import { memo, useMemo } from "react";
import { makePlotlyData } from "@/components/plotly/formatPlotlyData";
import PlotlyComponent from "@/components/plotly/PlotlyComponent";
import CompositePlot from "@/assets/nodes/CompositePlot";
import ProphetComponents from "@/assets/nodes/ProphetComponents";
import ProphetPlot from "@/assets/nodes/ProphetPlot";
import ArrayView from "@/assets/nodes/ArrayView";
import MatrixView from "@/assets/nodes/MatrixView";
import BigNumber from "@/assets/nodes/BigNumber";
import BoxPlot from "@/assets/nodes/BoxPlot";
import Histogram from "@/assets/nodes/Histogram";
import LineChart from "@/assets/nodes/LineChart";
import Scatter3D from "@/assets/nodes/3DScatter";
import Surface3D from "@/assets/nodes/3DSurface";
import Bar from "@/assets/nodes/Bar";
import Table from "@/assets/nodes/Table";
import Image from "@/assets/nodes/Image";
import MarkDownText from "@/components/common/MarkDownText";
import PeakFinder from "@/assets/nodes/PeakFinder";
import RegionInspector from "@/assets/nodes/RegionInspector";
import { useTheme } from "@src/providers/theme-provider";

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
  TEXT_VIEW: <Table />,
  EXTREMA_DETERMINATION: <PeakFinder />,
  REGION_PROPERTIES: <RegionInspector />,
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
