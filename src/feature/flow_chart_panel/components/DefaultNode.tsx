import { useFlowChartState } from "../../../hooks/useFlowChartState";
import HandleComponent from "../components/HandleComponent";
import { CustomNodeProps } from "../types/CustomNodeProps";
import "@feature/flow_chart_panel/style/defaultNode.css";
import NodeWrapper from "./wrapper/NodeWrapper";

const DefaultNode = ({ data }: CustomNodeProps) => {
  const params = data.inputs || [];

  return (
    <NodeWrapper data={data}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <HandleComponent data={data} inputs={params} />
      </div>
    </NodeWrapper>
  );
};

export default DefaultNode;
