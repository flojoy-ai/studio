import { CustomNodeProps } from "@/renderer/types/node";
import { memo, useMemo, useState } from "react";
import { makePlotlyData } from "@/renderer/components/plotly/formatPlotlyData";
import PlotlyComponent from "@/renderer/components/plotly/PlotlyComponent";
import MarkDownText from "@/renderer/components/common/MarkDownText";
import { useTheme } from "@/renderer/providers/themeProvider";
import { useNodeStatus } from "@/renderer/hooks/useNodeStatus";
import { NodeResizer, useUpdateNodeInternals } from "reactflow";
import VisorSvg from "@/renderer/assets/blocks/visor-svg";
import DefaultBlock from "./default-block";

const VisorBlock = (props: CustomNodeProps) => {
  const { selected, id, data } = props;
  const { resolvedTheme } = useTheme();
  const { nodeResult } = useNodeStatus(data.id);

  const plotlyFig = nodeResult?.result?.plotly_fig;
  const textBlob = nodeResult?.result?.text_blob;

  const plotlyData = useMemo(
    () =>
      plotlyFig ? makePlotlyData(plotlyFig.data, resolvedTheme, true) : null,
    [plotlyFig, resolvedTheme],
  );

  const [dimensions, setDimensions] = useState({ width: 225, height: 205 });

  const updateNodeInternals = useUpdateNodeInternals();

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
      <DefaultBlock {...props} variant="accent5" width={dimensions.width}>
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
          {!plotlyData && !textBlob && (
            <div className="p-3">
              <VisorSvg blockName={data.func} />
            </div>
          )}
        </>
      </DefaultBlock>
    </>
  );
};

export default memo(VisorBlock);
