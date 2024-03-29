import { BlockProps } from "@/renderer/types/block";
import { memo, useEffect, useMemo, useState } from "react";
import { makePlotlyData } from "@/renderer/components/plotly/formatPlotlyData";
import PlotlyComponent from "@/renderer/components/plotly/PlotlyComponent";
import MarkDownText from "@/renderer/components/common/MarkDownText";
import { useTheme } from "@/renderer/providers/theme-provider";
import { useBlockStatus } from "@/renderer/hooks/useBlockStatus";
import { NodeResizer, useUpdateNodeInternals } from "reactflow";
import DefaultBlock from "./default-block";
import { useBlockIcon } from "@/renderer/hooks/useBlockIcon";
import { useProjectStore } from "@/renderer/stores/project";

const VisorBlock = (props: BlockProps) => {
  const { selected, data, id } = props;
  const { SvgIcon } = useBlockIcon(props.type.toLowerCase(), props.data.func);
  const nodes = useProjectStore((state) => state.nodes);

  const { resolvedTheme } = useTheme();
  const { blockResult } = useBlockStatus(data.id);

  const plotlyFig = blockResult?.plotly_fig;
  const textBlob = blockResult?.text_blob;

  const plotlyData = useMemo(
    () =>
      plotlyFig ? makePlotlyData(plotlyFig.data, resolvedTheme, true) : null,
    [plotlyFig, resolvedTheme],
  );

  const maxInputOutput = useMemo(
    () => Math.max(data.inputs?.length ?? 0, data.outputs?.length ?? 0),
    [data.inputs?.length, data.outputs?.length],
  );
  const [dimensions, setDimensions] = useState({
    height: maxInputOutput > 1 ? maxInputOutput * 58 + 38 : 225,
    width: 225,
  });

  const updateNodeInternals = useUpdateNodeInternals();

  // TODO: Fix this
  useEffect(() => {
    // Weird hack to make it properly set the dimensions when loading an app...
    // I tried like 10 different things but this is the only thing that works without being crazy slow
    const node = nodes.find((n) => n.id === id);
    if (node?.width && node?.height) {
      setDimensions({ width: node.width, height: node.height });
    }
  }, [id, nodes]);

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
      <DefaultBlock
        {...props}
        variant="accent5"
        height={dimensions.height}
        width={dimensions.width}
        wrapperStyle={dimensions}
      >
        <>
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
          {!plotlyData && !textBlob && SvgIcon && (
            <div className="p-3">
              <SvgIcon />
            </div>
          )}
        </>
      </DefaultBlock>
    </>
  );
};

export default memo(VisorBlock);
