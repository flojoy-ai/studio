import { Handle, Position } from "reactflow";
import { useFlowChartState } from "../../../hooks/useFlowChartState";
import styledPlotLayout from "@src/feature/common/defaultPlotLayout";
import PlotlyComponent from "@src/feature/common/PlotlyComponent";
import { ResultNodeData } from "../types/ResultsType";
import { useMantineColorScheme } from "@mantine/core";
interface CustomResultNodeProp {
  data: ResultNodeData;
}
const CustomResultNode: React.FC<CustomResultNodeProp> = ({ data }) => {
  const { colorScheme } = useMantineColorScheme();
  const styledLayout = styledPlotLayout(colorScheme);

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
          data={data?.resultData?.default_fig?.data!}
          layout={Object.assign({}, { title: data.label }, styledLayout)}
          useResizeHandler
          style={{
            height: 190,
            width: 210,
          }}
        />
      )}
    </div>
  );
};

export default CustomResultNode;
