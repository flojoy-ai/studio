import { useFlowChartState } from "@hooks/useFlowChartState";
import HandleComponent from "@feature/flow_chart_panel/components/HandleComponent";
import { CustomNodeProps } from "@feature/flow_chart_panel/types/CustomNodeProps";
import "@feature/flow_chart_panel/style/defaultNode.css";
import NodeWrapper from "../wrapper/NodeWrapper";

const ConditionalNode = ({ data }: CustomNodeProps) => {
  const { uiTheme, runningNode, failedNode } = useFlowChartState();
  const params = data.inputs || [];

  return (
    <NodeWrapper
      data={data}
      uiTheme={uiTheme}
      rootStyle={{
        ...(runningNode === data.id && { boxShadow: "0 0 50px 15px #48abe0" }),
        ...(failedNode === data.id && {
          boxShadow: "rgb(183 0 0) 0px 0px 50px 15px",
        }),
      }}
      childClassName={"default_node_container"}
      childStyle={{
        backgroundColor:
          uiTheme === "light" ? "rgb(123 97 255 / 16%)" : "#99f5ff4f",
        border:
          uiTheme === "light"
            ? "1px solid rgba(123, 97, 255, 1)"
            : "1px solid #99F5FF",
        color: uiTheme === "light" ? "rgba(123, 97, 255, 1)" : "#99F5FF",
        ...(params.length > 0 && { padding: "0px 0px 8px 0px" }),
      }}
    >
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
