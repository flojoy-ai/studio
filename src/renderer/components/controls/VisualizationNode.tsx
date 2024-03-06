import clsx from "clsx";
import { memo, useMemo, useState } from "react";
import { makePlotlyData } from "@/renderer/components/plotly/formatPlotlyData";
import MarkDownText from "@/renderer/components/common/MarkDownText";
import { useTheme } from "@/renderer/providers/ThemeProvider";
import { useNodeStatus } from "@/renderer/hooks/useNodeStatus";
import { NodeResizer, useUpdateNodeInternals } from "reactflow";
import { chartElemMap } from "@/renderer/components/nodes/VisorBlock";
import { NodeProps } from "reactflow";
import { VisualizationData } from "@/renderer/types/control";
import PlotlyComponent from "@/renderer/components/plotly/PlotlyComponent";

const VisualizationNode = ({
  selected,
  id,
  data,
}: NodeProps<VisualizationData>) => {
  const { resolvedTheme } = useTheme();
  const { nodeResult } = useNodeStatus(data.blockId);

  const plotlyFig = nodeResult?.plotly_fig;
  const textBlob = nodeResult?.text_blob;

  const plotlyData = useMemo(
    () =>
      plotlyFig ? makePlotlyData(plotlyFig.data, resolvedTheme, true) : null,
    [plotlyFig, resolvedTheme],
  );

  const [dimensions, setDimensions] = useState({ width: 225, height: 225 });

  const updateNodeInternals = useUpdateNodeInternals();

  const ChartIcon = chartElemMap[data.visualizationType];
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
      <div
        className={clsx("rounded-2xl border bg-transparent")}
        style={dimensions}
      >
        {plotlyData && (
          <PlotlyComponent
            data={plotlyData}
            id={id}
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
                Visualization
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default memo(VisualizationNode);
