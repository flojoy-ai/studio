import { CustomNodeProps, ElementsData } from "@src/types/node";
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
import { NodeResizer, useReactFlow } from "reactflow";

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

const PLOT_ASPECT_RATIO = 1.4;

const VisorNode = ({ selected, data, id }: CustomNodeProps) => {
  const { resolvedTheme } = useTheme();
  const { nodeRunning, nodeError, nodeResult } = useNodeStatus(data.id);
  const { setNodes } = useReactFlow<ElementsData>();

  const plotlyFig = nodeResult?.result?.plotly_fig;
  const textBlob = nodeResult?.result?.text_blob;

  const plotlyData = useMemo(
    () =>
      plotlyFig ? makePlotlyData(plotlyFig.data, resolvedTheme, true) : null,
    [plotlyFig, resolvedTheme],
  );

  const [dimensions, setDimensions] = useState({ width: 225, height: 225 });

  const ChartIcon = chartElemMap[data.func];

  useEffect(() => {
    setNodes((nodes) => nodes.map(
      n => {
        if (n.id === id) {
          return {
            ...n,
            dimensions: {
              width: dimensions.width * PLOT_ASPECT_RATIO,
              height: dimensions.height
            }
          }
        }
        return n;
      }
    ))
  }, [plotlyData])

  return (
    <>
      <NodeResizer
        minWidth={225}
        minHeight={225}
        keepAspectRatio
        onResize={(_, params) => {
          const newSize = Math.max(params.width, params.height);
          setDimensions({ width: params.width, height: newSize });
        }}
        isVisible={selected}
      />
      <NodeWrapper nodeError={nodeError} data={data} selected={selected} style={dimensions}>
        <div
          className={clsx(
            "rounded-2xl bg-transparent",
            { "shadow-around shadow-accent2": nodeRunning || selected },
            { "shadow-around shadow-red-700": nodeError },
          )}
        >
          {plotlyData && (
            <PlotlyComponent
              data={plotlyData}
              id={data.id}
              layout={plotlyFig?.layout ?? {}}
              useResizeHandler
              isThumbnail
              style={{
                width: dimensions.width * PLOT_ASPECT_RATIO,
                height: dimensions.height
              }}
            />
          )}
          {textBlob && <MarkDownText text={textBlob} isThumbnail />}
          {!plotlyData && !textBlob && (
            <>
              {ChartIcon ? <ChartIcon className="w-full h-full" /> : (
                <div className="flex items-center justify-center break-all rounded-lg border-2 border-accent2 bg-accent2/5 p-2 text-center text-2xl font-bold tracking-wider text-accent2 w-full h-full">
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
