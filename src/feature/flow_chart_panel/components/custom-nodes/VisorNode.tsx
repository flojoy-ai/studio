import { useFlowChartState } from "@hooks/useFlowChartState";
import HandleComponent from "@feature/flow_chart_panel/components/HandleComponent";
import {
  CustomNodeProps,
  ElementsData,
} from "@feature/flow_chart_panel/types/CustomNodeProps";
import { BGTemplate } from "../../svgs/histo-scatter-svg";
import Scatter from "../nodes/Scatter";
import Histogram from "../nodes/Histogram";
import LineChart from "../nodes/line-chart";
import Surface3D from "../nodes/3d-surface";
import Scatter3D from "../nodes/3d-scatter";
import BarChart from "../nodes/bar";

const getboxShadow = (data: ElementsData) => {
  if (data.func in highlightShadow){
    return highlightShadow[data.func];
  }
  return highlightShadow['default']
};


const VisorNode = ({ data }: CustomNodeProps) => {
  const { uiTheme, runningNode, failedNode } = useFlowChartState();
  const params = data.inputs || [];
  return (
    <div
      style={{
        ...(runningNode === data.id && getboxShadow(data)),
        ...(failedNode === data.id && {
          boxShadow: "rgb(183 0 0) 0px 0px 50px 15px",
        }),
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          fontSize: "17px",
          color: uiTheme === "light" ? "#2E83FF" : "rgba(123, 97, 255, 1)",
          background: "transparent",
          height: "fit-content",
          minHeight: 115,
          ...(params.length > 0 && { padding: "0px 0px 8px 0px" }),
        }}
      >
        {data.func === "SCATTER" && <Scatter theme={uiTheme} />}
        {data.func === "HISTOGRAM" && <Histogram theme={uiTheme} />}
        {data.func === "LINE" && <LineChart theme={uiTheme} />}
        {data.func === "SURFACE3D" && <Surface3D theme={uiTheme} />}
        {data.func === "SCATTER3D" && <Scatter3D theme={uiTheme} />}
        {data.func === "BAR" && <BarChart theme={uiTheme} />}
        <BGTemplate theme={uiTheme} />
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

export default VisorNode;

const highlightShadow = {
  default: { boxShadow: "0 0 50px 15px #48abe0" },
  HISTOGRAM: { boxShadow: "0 0 50px 15px #48abe0" },
  SCATTER: { boxShadow: "0 0 50px 15px #48abe0" },
  SURFACE3D: { boxShadow: "0 0 50px 15px #48abe0" },
  SCATTER3D: { boxShadow: "0 0 50px 15px #48abe0" },
  BAR: { boxShadow: "0 0 50px 15px #48abe0" },
  LINE: { boxShadow: "0 0 50px 15px #48abe0" },
};
