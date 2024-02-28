import { CustomNodeProps } from "@/renderer/types/node";
import NodeWrapper from "@/renderer/components/common/NodeWrapper";
import clsx from "clsx";
import HandleComponent from "@/renderer/components/common/HandleComponent";
import Scatter from "@/renderer/assets/blocks/Scatter";
import { memo, useEffect, useMemo, useState } from "react";
import { makePlotlyData } from "@/renderer/components/plotly/formatPlotlyData";
import PlotlyComponent from "@/renderer/components/plotly/PlotlyComponent";
import CompositePlot from "@/renderer/assets/blocks/CompositePlot";
import ProphetComponents from "@/renderer/assets/blocks/ProphetComponents";
import ProphetPlot from "@/renderer/assets/blocks/ProphetPlot";
import ArrayView from "@/renderer/assets/blocks/ArrayView";
import MatrixView from "@/renderer/assets/blocks/MatrixView";
import BigNumber from "@/renderer/assets/blocks/BigNumber";
import BoxPlot from "@/renderer/assets/blocks/BoxPlot";
import Histogram from "@/renderer/assets/blocks/Histogram";
import LineChart from "@/renderer/assets/blocks/LineChart";
import Scatter3D from "@/renderer/assets/blocks/3DScatter";
import Surface3D from "@/renderer/assets/blocks/3DSurface";
import Bar from "@/renderer/assets/blocks/Bar";
import Table from "@/renderer/assets/blocks/Table";
import Image from "@/renderer/assets/blocks/Image";
import MarkDownText from "@/renderer/components/common/MarkDownText";
import { useTheme } from "@/renderer/providers/themeProvider";
import PeakFinder from "@/renderer/assets/blocks/PeakFinder";
import RegionInspector from "@/renderer/assets/blocks/RegionInspector";
import TextView from "@/renderer/assets/blocks/TextView";
import Heatmap from "@/renderer/assets/blocks/Heatmap";
import { useNodeStatus } from "@/renderer/hooks/useNodeStatus";
import { NodeResizer, useUpdateNodeInternals } from "reactflow";
import { useAtomValue } from "jotai";
import { projectAtom } from "@/renderer/hooks/useFlowChartState";

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

  const updateNodeInternals = useUpdateNodeInternals();

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
          updateNodeInternals(id);
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
