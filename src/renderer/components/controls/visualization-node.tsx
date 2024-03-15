import clsx from "clsx";
import { memo, useMemo } from "react";
import { makePlotlyData } from "@/renderer/components/plotly/formatPlotlyData";
import MarkDownText from "@/renderer/components/common/MarkDownText";
import { useTheme } from "@/renderer/providers/theme-provider";
import { useBlockStatus } from "@/renderer/hooks/useBlockStatus";
import { NodeResizer, useUpdateNodeInternals } from "reactflow";
import { NodeProps } from "reactflow";
import { VisualizationData } from "@/renderer/types/control";
import PlotlyComponent from "@/renderer/components/plotly/PlotlyComponent";
import { useProjectStore } from "@/renderer/stores/project";
import { useBlockIcon } from "@/renderer/hooks/useBlockIcon";

const VisualizationNode = ({
  selected,
  id,
  data,
}: NodeProps<VisualizationData>) => {
  const { resolvedTheme } = useTheme();
  const { blockResult } = useBlockStatus(data.blockId);
  const { vizNodes, blocks } = useProjectStore((state) => ({
    vizNodes: state.controlVisualizationNodes,
    blocks: state.nodes,
  }));

  const plotlyFig = blockResult?.plotly_fig;
  const textBlob = blockResult?.text_blob;

  const plotlyData = useMemo(
    () =>
      plotlyFig ? makePlotlyData(plotlyFig.data, resolvedTheme, true) : null,
    [plotlyFig, resolvedTheme],
  );

  const updateNodeInternals = useUpdateNodeInternals();

  const thisNode = vizNodes.find((b) => b.id === id);
  const mirroredBlock = blocks.find((b) => b.id === data.blockId);
  if (!mirroredBlock) {
    throw new Error("Block to mirror not found, this shouldn't happen");
  }

  const dimensions = {
    width: thisNode?.width ?? 225,
    height: thisNode?.height ?? 225,
  };

  const { SvgIcon } = useBlockIcon("visualization", mirroredBlock.data.func);

  const iconSideLength = Math.min(dimensions.width, dimensions.height);

  return (
    <>
      <NodeResizer
        minWidth={225}
        minHeight={225}
        isVisible={selected}
        lineClassName="p-1"
        handleClassName="p-1"
        onResizeEnd={() => {
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
            {SvgIcon ? (
              <SvgIcon width={iconSideLength} height={iconSideLength} />
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
