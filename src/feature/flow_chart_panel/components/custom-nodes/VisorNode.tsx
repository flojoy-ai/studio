import { useFlowChartState } from "@hooks/useFlowChartState";
import HandleComponent from "@feature/flow_chart_panel/components/HandleComponent";
import { CustomNodeProps } from "@feature/flow_chart_panel/types/CustomNodeProps";
import Scatter from "../nodes/Scatter";
import Histogram from "../nodes/Histogram";
import LineChart from "../nodes/line-chart";
import Surface3D from "../nodes/3d-surface";
import Scatter3D from "../nodes/3d-scatter";
import BarChart from "../nodes/bar";
import NodeWrapper from "../wrapper/NodeWrapper";

const VisorNode = ({ data }: CustomNodeProps) => {
  const { uiTheme } = useFlowChartState();
  const params = data.inputs || [];
  return (
    <NodeWrapper data={data}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: "17px",
          color: uiTheme === "light" ? "#2E83FF" : "rgba(123, 97, 255, 1)",
          background: "transparent",
          height: "fit-content",
          minHeight: 115,
          ...(params.length > 0 && { padding: "0px 0px 8px 0px" }),
          width: "250px",
        }}
      >
        {data.func === "SCATTER" && <Scatter theme={uiTheme} />}
        {data.func === "HISTOGRAM" && <Histogram theme={uiTheme} />}
        {data.func === "LINE" && <LineChart theme={uiTheme} />}
        {data.func === "SURFACE3D" && <Surface3D theme={uiTheme} />}
        {data.func === "SCATTER3D" && <Scatter3D theme={uiTheme} />}
        {data.func === "BAR" && <BarChart theme={uiTheme} />}
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

export default VisorNode;
