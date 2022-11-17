import { useFlowChartState } from "../../../hooks/useFlowChartState";
import HandleComponent from "../components/HandleComponent";
import NodeComponent from "../components/NodeComponent";
import { NodeStyle } from "../style/NodeStyle";
import { CustomNodeProps } from "../types/CustomNodeProps";

const CustomNode = ({ data }: CustomNodeProps) => {
  const { uiTheme } = useFlowChartState();
  const params = data.inputs || [];
  
  return (
    <div
      style={{
        position: "relative",
        ...NodeStyle(data, uiTheme),
        height: "fit-content",
        minHeight: 115,
        ...(params.length > 0 && { paddingBottom: "8px" }),
      }}
    >
      <NodeComponent data={data} uiTheme={uiTheme} params={params} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: params.length > 0 ? (params.length + 1) * 30 : "fit-content",
        }}
      >
        <HandleComponent data={data} inputs={params} />
      </div>
    </div>
  );
};

export default CustomNode;