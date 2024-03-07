import { BlockProps } from "@/renderer/types/block";
import { memo, useMemo, useState } from "react";
import { makePlotlyData } from "@/renderer/components/plotly/formatPlotlyData";
import PlotlyComponent from "@/renderer/components/plotly/PlotlyComponent";
import MarkDownText from "@/renderer/components/common/MarkDownText";
import { useTheme } from "@/renderer/providers/them-provider";
import { useBlockStatus } from "@/renderer/hooks/useNodeStatus";
import { NodeResizer, useUpdateNodeInternals } from "reactflow";
import DefaultBlock from "./default-block";
import { useBlockIcon } from "@/renderer/hooks/useBlockIcon";
// import { useSocketStore } from "@/renderer/stores/socket";

const VisorBlock = (props: BlockProps) => {
  const { selected, id, data } = props;
  const { SvgIcon } = useBlockIcon(props.type.toLowerCase(), props.data.func);
  const { resolvedTheme } = useTheme();
  const { blockResult } = useBlockStatus(data.id);
  // const blockResults = useRef(useSocketStore.getState().blockResults);
  // useEffect(() => {
  //   useSocketStore.subscribe((state) => {
  //     blockResults.current = state.blockResults;
  //   });
  // }, []);
  // const blockResult = blockResults.current[data.id];

  const plotlyFig = blockResult?.plotly_fig;
  const textBlob = blockResult?.text_blob;

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
