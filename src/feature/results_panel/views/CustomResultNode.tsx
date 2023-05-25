import { useMantineTheme } from "@mantine/core";
import PlotlyComponent from "@src/feature/common/PlotlyComponent";
import usePlotLayout from "@src/feature/common/usePlotLayout";
import { Handle, Position } from "reactflow";
import { ResultNodeData } from "../types/ResultsType";
import { makePlotlyData } from "@src/utils/format_plotly_data";

type CustomResultNodeProp = {
  data: ResultNodeData;
};

const CustomResultNode = ({ data }: CustomResultNodeProp) => {
  const theme = useMantineTheme();

  return (
    <div style={{ position: "relative" }} data-testid="result-node">
      <>
        <Handle
          type="target"
          position={Position.Left}
          style={{ borderRadius: 0 }}
        />
        <Handle
          type="source"
          position={Position.Right}
          style={{ borderRadius: 0 }}
        />
      </>

      {!data?.resultData ? (
        <p> NO Result </p>
      ) : (
        <PlotlyComponent
          id={data.id}
          data={makePlotlyData(data.resultData.default_fig.data, theme, true)}
          layout={{
            ...data.resultData.default_fig.layout,
            title: data.resultData.default_fig.layout?.title || data.label,
          }}
          useResizeHandler
          style={{
            height: 293,
            width: 380,
          }}
          isThumbnail
        />
      )}
    </div>
  );
};

export default CustomResultNode;
