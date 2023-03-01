import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { CSSProperties } from "react";
import { DetailsButtonSVG } from "../../svgs/details-button-svg";
import { NodeDeleteSVG } from "../../svgs/node-delete-svg";
import { ElementsData } from "../../types/CustomNodeProps";

type params = {
  data?: any;
  children: any;
  backGroundStyle?: CSSProperties;
  boxShadowStyle?: CSSProperties;
};

const NodeWrapper = ({
  data,
  children,
  backGroundStyle,
  boxShadowStyle,
}: params) => {
  const { uiTheme, runningNode, failedNode } = useFlowChartState();

  const getboxShadow = (data: ElementsData) => {
    if (data.type in highlightShadow) {
      if (data.func in highlightShadow[data.type]) {
        return highlightShadow[data.type][data.func];
      }
      return highlightShadow[data.type]["default"];
    }
    return highlightShadow["default"];
  };
  return (
    <div
      style={{
        ...(runningNode === data.id && getboxShadow(data)),
        ...(failedNode === data.id && {
          boxShadow: "rgb(183 0 0) 0px 0px 50px 15px",
        }),
        ...boxShadowStyle,
      }}
    >
      <div
        className="default_node_container"
        style={{
          backgroundColor: uiTheme === "light" ? "#EAE6FF" : "#243438",
          border:
            uiTheme === "light"
              ? "1px solid rgba(123, 97, 255, 1)"
              : "1px solid #99F5FF",
          color: uiTheme === "light" ? "rgba(123, 97, 255, 1)" : "#99F5FF",
          ...backGroundStyle,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "5px",
              width: "100%",
              borderBottom: "1px solid",
              height: "40px",
            }}
          >
            {data && (
              <div>
                <div>
                  {data.label === "+"
                    ? "ADD"
                    : data.label === "X"
                    ? "MULTIPLY"
                    : data.label}
                </div>
              </div>
            )}
            <div
              style={{
                zIndex: "999",
                display: "flex",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <DetailsButtonSVG theme={uiTheme} />
              <NodeDeleteSVG theme={uiTheme} />
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default NodeWrapper;

const highlightShadow = {
  SIMULATION: {
    LINSPACE: { boxShadow: "0 0 50px 15px #48abe0" },
    default: { boxShadow: "rgb(116 24 181 / 97%) 0px 0px 50px 15px" },
  },
  VISOR: {
    default: { boxShadow: "0 0 50px 15px #48abe0" },
    HISTOGRAM: { boxShadow: "0 0 50px 15px #48abe0" },
    SCATTER: { boxShadow: "0 0 50px 15px #48abe0" },
    SURFACE3D: { boxShadow: "0 0 50px 15px #48abe0" },
    SCATTER3D: { boxShadow: "0 0 50px 15px #48abe0" },
    BAR: { boxShadow: "0 0 50px 15px #48abe0" },
    LINE: { boxShadow: "0 0 50px 15px #48abe0" },
  },
  ARITHMETIC: {
    default: {
      boxShadow: "rgb(112 96 13) 0px 0px 50px 15px",
      background: "#78640f96",
    },
    MULTIPLY: {
      boxShadow: "rgb(112 96 13) 0px 0px 50px 15px",
      background: "#78640f96",
    },
    ADD: {
      boxShadow: "rgb(112 96 13) 0px 0px 50px 15px",
      background: "#78640f96",
    },
  },
  TERMINATOR: {
    default: { boxShadow: "0 0 50px 15px #48abe0" },
  },
  default: { boxShadow: "0 0 50px 15px #48abe0" },
};
