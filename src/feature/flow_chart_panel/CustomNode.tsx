import React, { Fragment } from "react";
import { Handle, Position } from "react-flow-renderer";
import { useFlowChartState } from "../../hooks/useFlowChartState";
import { ElementsData } from "./ControlBar";
import Scatter3D from "./nodes/3d-scatter";
import Surface3D from "./nodes/3d-surface";
import BarChart from "./nodes/bar";
import Histogram from "./nodes/Histogram";
import LineChart from "./nodes/line-chart";
import Scatter from "./nodes/Scatter";
import { AddBGTemplate, AddSvg, MultiplySvg } from "./svgs/add-multiply-svg";
import { BGTemplate } from "./svgs/histo-scatter-svg";
interface CustomNodeProps {
  data: ElementsData;
}
const getNodeStyle = (
  data: CustomNodeProps["data"],
  theme: "light" | "dark"
): React.CSSProperties | undefined => {
  if (data.func === "LINSPACE") {
    return {
      // background: '#9CA8B3',
      padding: 10,
      height: "105px",
      width: "192px",
      boxShadow: "0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24)",
      fontWeight: 600,
      // borderRadius: "65px",
      borderRadius: "6px",
      backgroundColor:
        theme === "light" ? "rgb(123 97 255 / 16%)" : "#99f5ff4f",
      border:
        theme === "light"
          ? "1px solid rgba(123, 97, 255, 1)"
          : "1px solid #99F5FF",
      color: theme === "light" ? "rgba(123, 97, 255, 1)" : "#99F5FF",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "17px",
    };
  } else if (
    data.func === "SINE" ||
    data.func === "RAND" ||
    data.func === "CONSTANT"
  ) {
    return {
      height: "115px",
      width: "115px",
      borderRadius: "6px",
      border:
        theme === "light"
          ? "1px solid #2E83FF"
          : "1px solid rgba(123, 97, 255, 1)",
      backgroundColor:
        theme === "light" ? "rgba(46, 131, 255, 0.2)" : "rgb(123 97 255 / 16%)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "17px",
      color: theme === "light" ? "#2E83FF" : "rgba(123, 97, 255, 1)",
    };
  } else {
    return {
      display: "flex",
      alignItems: "center",
      fontSize: "17px",
      color: theme === "light" ? "#2E83FF" : "rgba(123, 97, 255, 1)",
    };
  }
};

const CustomNode = ({ data }: CustomNodeProps) => {
  const { uiTheme } = useFlowChartState();
  const params = data.inputs || [];
  return (
    <div 
      style={{
        position: "relative",
        ...getNodeStyle(data, uiTheme),
        height: "fit-content",
        minHeight: 115,
        ...(params.length > 0 && { paddingBottom: "8px" }),
      }}
    >
      <NodeComponent data={data} uiTheme={uiTheme} params={params} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: params.length > 0 ? (params.length + 1) * 30 : "fit-content",
        }}
        data-test-id={'flow-chart'}
      >
        <HandleComponent data={data} inputs={params} />
      </div>
    </div>
  );
};

export default CustomNode;

const NodeComponent = ({
  data,
  uiTheme,
  params,
}: CustomNodeProps & {
  uiTheme: any;
  params: ElementsData['inputs'];
}) => {
  if (data.func === "MULTIPLY" || data.func === "ADD") {
    return (
      <div style={{ position: "relative" }} data-test-id={'flow-chart'}>
        <Handle
          type="target"
          position={Position.Left}
          style={{ borderRadius: 0 }}
        />
        <Handle
          type="source"
          position={Position.Right}
          style={{ borderRadius: 0 }}
        />

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
      </div>
    );
  }
  if (data.type === "VISOR") {
    return (
      <Fragment>
        {data.func === "SCATTER" && <Scatter theme={uiTheme} />}
        {data.func === "HISTOGRAM" && <Histogram theme={uiTheme} />}
        {data.func === "LINE" && <LineChart theme={uiTheme} />}
        {data.func === "SURFACE3D" && <Surface3D theme={uiTheme} />}
        {data.func === "SCATTER3D" && <Scatter3D theme={uiTheme} />}
        {data.func === "BAR" && <BarChart theme={uiTheme} />}
        <BGTemplate theme={uiTheme} />
      </Fragment>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "5px",
        width: "100%",
      }}
    >
      <div>{data.label}</div>
    </div>
  );
};

const HandleComponent = ({
  data,
  inputs,
}: CustomNodeProps & {
  inputs: ElementsData['inputs'];
}) => {
  const params = inputs || [];
  return (
    <Fragment>
      <Handle
        type="source"
        position={Position.Right}
        style={{ borderRadius: 0, height: 8, width: 8 }}
      />
       <Handle
        type="target"
        position={Position.Left}
        style={{
          borderRadius: 0,
          height: 8,
          width: 8,
          ...(params.length > 0 && { top: 15 }),
        }}
        id={data.func}
      />

      {params.length > 0 &&
        params.map((param, i) => (
          <Handle
            key={param.id}
            type="target"
            position={Position.Left}
            style={{
              gap: "5px",
              borderRadius: 0,
              top: 30 * (i + 1) + 40,
              minHeight: 10,
              display: "flex",
              alignItems: "center",
              background: "transparent",
              border: 0,
            }}
            id={param.id}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  height: 8,
                  width: 8,
                  backgroundColor: "#000",
                  border: "1px solid #fff",
                }}
              ></div>
              <div style={{ paddingLeft: "8px" }}>{param.name}</div>
            </div>
          </Handle>
        ))}
    </Fragment>
  );
};
