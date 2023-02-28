import { useFlowChartState } from "../../../hooks/useFlowChartState";
import HandleComponent from "../components/HandleComponent";
import { CustomNodeProps } from "../types/CustomNodeProps";
import "@feature/flow_chart_panel/style/defaultNode.css";
import NodeWrapper from "./wrapper/NodeWrapper";

const DefaultNode = ({ data }: CustomNodeProps) => {
  const { uiTheme } = useFlowChartState();
  const params = data.inputs || [];

  return (
    <NodeWrapper data={data}>
      <div
        className="default_node_container"
        style={{
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
            backgroundColor: "white",
            display: "flex",
            justifyContent: "flex-end",
            padding: "5px",
            width: "100%",
            textAlign: "center",
            top: "0",
            position: "absolute",
            right: 0,
          }}
        >
          <button>DETAILS</button>
          <button>CLOSE</button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "5px",
            width: "100%",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <div>{data.label}</div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height:
              params.length > 0 ? (params.length + 1) * 40 : "fit-content",
          }}
        >
          <HandleComponent data={data} inputs={params} />
        </div>
      </div>
    </NodeWrapper>
  );
};

export default DefaultNode;
