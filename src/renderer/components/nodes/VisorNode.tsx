import { CustomNodeProps } from "@src/types/node";
import NodeWrapper from "@src/components/common/NodeWrapper";
import clsx from "clsx";
import HandleComponent from "@src/components/common/HandleComponent";
import Scatter from "@src/assets/nodes/Scatter";
import { memo, useEffect, useMemo, useState } from "react";
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
import { useNodeStatus } from "@src/hooks/useNodeStatus";
import { NodeResizer } from "reactflow";
import { useAtomValue } from "jotai";
import { projectAtom } from "@src/hooks/useFlowChartState";

const chartElemMap = {
  SCATTER: Scatter,
  HISTOGRAM: Histogram,
  LINE: LineChart,
  SURFACE3D: Surface3D,
  SCATTER3D: Scatter3D,
  BAR: Bar,
  TABLE: Table,
  IMAGE: Image,
  BOX: BoxPlot,
  BIG_NUMBER: BigNumber,
  MATRIX_VIEW: MatrixView,
  ARRAY_VIEW: ArrayView,
  PROPHET_PLOT: ProphetPlot,
  PROPHET_COMPONENTS: ProphetComponents,
  COMPOSITE: CompositePlot,
  TEXT_VIEW: TextView,
  EXTREMA_DETERMINATION: PeakFinder,
  REGION_PROPERTIES: RegionInspector,
  HEATMAP: Heatmap,
};

const VisorNode = ({ selected, id, data }: CustomNodeProps) => {
  const { resolvedTheme } = useTheme();
  const { nodeRunning, nodeError, nodeResult } = useNodeStatus(data.id);

  const plotlyFig = nodeResult?.result?.plotly_fig;
  const textBlob = nodeResult?.result?.text_blob;

  const plotlyData = useMemo(
    () =>
      plotlyFig ? makePlotlyData(plotlyFig.data, resolvedTheme, true) : null,
    [plotlyFig, resolvedTheme],
  );

  const project = useAtomValue(projectAtom);
  const [dimensions, setDimensions] = useState({ width: 225, height: 225 });

  useEffect(() => {
    // Weird hack to make it properly set the dimensions when loading an app...
    // I tried like 10 different things but this is the only thing that works without being crazy slow
    const node = project.rfInstance?.nodes.find((n) => n.id === id);
    if (node?.width && node?.height) {
      setDimensions({ width: node.width, height: node.height });
    }
  }, [id, project]);

  const ChartIcon = chartElemMap[data.func];
  const iconSideLength = Math.min(dimensions.width, dimensions.height);

  console.log(iconSideLength);

  return (
    <>
      <NodeResizer
        minWidth={225}
        minHeight={225}
        isVisible={selected}
        lineClassName="p-1"
        handleClassName="p-1"
        onResizeEnd={(e, params) => {
          setDimensions({ width: params.width, height: params.height });
        }}
      />
      <NodeWrapper
        nodeError={nodeError}
        data={data}
        selected={selected}
        style={dimensions}
      >
        <div
          className={clsx(
            "rounded-2xl bg-transparent",
            { "shadow-around shadow-accent2": nodeRunning || selected },
            { "shadow-around shadow-red-700": nodeError },
          )}
          style={dimensions}
        >
          {plotlyData && (
            <PlotlyComponent
              data={plotlyData}
              id={data.id}
              layout={plotlyFig?.layout ?? {}}
              useResizeHandler
              isThumbnail
              style={dimensions}
            />
          )}
          {textBlob && <MarkDownText text={textBlob} isThumbnail />}
          {!plotlyData && !textBlob && (
            <>
              {ChartIcon ? (
                <ChartIcon width={iconSideLength} height={iconSideLength} />
              ) : (
                <div className="flex h-full w-full items-center justify-center break-all rounded-lg border-2 border-accent2 bg-accent2/5 p-2 text-center text-2xl font-bold tracking-wider text-accent2">
                  {data.label}
                </div>
              )}
            </>
          )}
          <HandleComponent data={data} variant="accent2" />
        </div>
      </NodeWrapper>
    </>
  );
};

export default memo(VisorNode);
