import { useFlowChartState } from "@hooks/useFlowChartState";
import HandleComponent from "@feature/flow_chart_panel/components/HandleComponent";
import {
  CustomNodeProps,
  ElementsData,
} from "@feature/flow_chart_panel/types/CustomNodeProps";
import {
  AddBGTemplate,
  AddSvg,
  MultiplySvg,
} from "../../svgs/add-multiply-svg";

const getboxShadow = (data: ElementsData) => {
  if (data.func in highlightShadow){
    return highlightShadow[data.func];
  }
  return highlightShadow['default']
};


const ArithmeticNode = ({ data }: CustomNodeProps) => {
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
        <AddBGTemplate />
        {data.func === "MULTIPLY" && (
          <MultiplySvg
            style={{
              position: "absolute",
              top: "47px",
              left: "29px",
              height: "19px",
              width: "18px",
            }}
          />
        )}
        {data.func === "ADD" && (
          <AddSvg
            style={{
              position: "absolute",
              top: "47px",
              left: "29px",
              height: "19px",
              width: "18px",
            }}
          />
        )}

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

export default ArithmeticNode;

const highlightShadow = {
  MULTIPLY: {
    boxShadow: "rgb(112 96 13) 0px 0px 50px 15px",
    background: "#78640f96",
  },
  ADD: {
    boxShadow: "rgb(112 96 13) 0px 0px 50px 15px",
    background: "#78640f96",
  },
};
