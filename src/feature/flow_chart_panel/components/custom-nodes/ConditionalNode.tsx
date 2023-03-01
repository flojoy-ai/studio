import HandleComponent from "@feature/flow_chart_panel/components/HandleComponent";
import { CustomNodeProps } from "@feature/flow_chart_panel/types/CustomNodeProps";
import "@feature/flow_chart_panel/style/defaultNode.css";
import NodeWrapper from "../wrapper/NodeWrapper";

const ConditionalNode = ({ data }: CustomNodeProps) => {
  const params = data.inputs || [];

  return (
    <NodeWrapper data={data}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: params.length > 0 ? (params.length + 1) * 40 : "fit-content",
        }}
      >
        <HandleComponent data={data} inputs={params} />
      </div>
    </NodeWrapper>
  );
};

export default ConditionalNode;
