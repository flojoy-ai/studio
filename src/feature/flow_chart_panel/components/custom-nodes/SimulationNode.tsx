import { useFlowChartState } from "@hooks/useFlowChartState";
import HandleComponent from "@feature/flow_chart_panel/components/HandleComponent";
import {
  CustomNodeProps,
  ElementsData,
} from "@feature/flow_chart_panel/types/CustomNodeProps";
import "@feature/flow_chart_panel/components/custom-nodes/css/simulationNode.css";
import NodeWrapper from "../wrapper/NodeWrapper";

const highlightShadow = {
  LINSPACE: { boxShadow: "0 0 50px 15px #48abe0" },
  default: { boxShadow: "rgb(116 24 181 / 97%) 0px 0px 50px 15px" },
};
const getboxShadow = (data: ElementsData) => {
  if (data.func in highlightShadow) {
    return highlightShadow[data.func];
  }
  return highlightShadow["default"];
};

const SimulationNode = ({ data }: CustomNodeProps) => {
  const { uiTheme, runningNode, failedNode } = useFlowChartState();
  const params = data.inputs || [];

  return (
    <NodeWrapper
      rootStyle={{
        ...(runningNode === data.id && getboxShadow(data)),
        ...(failedNode === data.id && {
          boxShadow: "rgb(183 0 0) 0px 0px 50px 15px",
        }),
      }}
      childClassName={"default_node_container"}
      childStyle={{
        border:
          uiTheme === "light"
            ? "1px solid #2E83FF"
            : "1px solid rgba(123, 97, 255, 1)",
        backgroundColor:
          uiTheme === "light"
            ? "rgba(46, 131, 255, 0.2)"
            : "rgb(123 97 255 / 16%)",
        color: uiTheme === "light" ? "#2E83FF" : "rgba(123, 97, 255, 1)",
        ...(params.length > 0 && { padding: "0px 0px 8px 0px" }),
      }}
      uiTheme={uiTheme}
      data={data}
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

export default SimulationNode;
