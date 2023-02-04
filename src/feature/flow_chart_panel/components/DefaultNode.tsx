import { useFlowChartState } from "../../../hooks/useFlowChartState";
import HandleComponent from "../components/HandleComponent";
import { CustomNodeProps } from "../types/CustomNodeProps";
import "@feature/flow_chart_panel/style/defaultNode.css";
import { useFlowChartTabState } from "../FlowChartTabState";

const DefaultNode = ({ data }: CustomNodeProps) => {
  const { uiTheme, runningNode, failedNode, deleteNode } = useFlowChartState();

  const params = data.inputs || [];

  const handleClick = () => {
    deleteNode(data.id);
  };

  return (
    <div
      style={{
        ...(runningNode === data.id && { boxShadow: "0 0 50px 15px #48abe0" }),
        ...(failedNode === data.id && {
          boxShadow: "rgb(183 0 0) 0px 0px 50px 15px",
        }),
      }}
    >
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
        <button
          style={{
            position: "fixed",
            top: "22px",
            right: 0,
            cursor: "pointer",
            zIndex: 999,
          }}
          onClick={handleClick}
        >
          X
        </button>
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
    </div>
  );
};

export default DefaultNode;
