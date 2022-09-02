import React from "react";
import { Handle, Position } from "react-flow-renderer";
import { useFlowChartState } from "../../hooks/useFlowChartState";
import { AddBGTemplate, AddSvg, MultiplySvg } from "./svgs/add-multiply-svg";
import {
  BGTemplate,
  HistoLabels,
  HistoTitle,
  ScatterBubbles,
  ScatterTitle,
} from "./svgs/histo-scatter-svg";

const getNodeStyle = (data, theme): React.CSSProperties | undefined => {
  if (data.label === "LINSPACE") {
    return {
      // background: '#9CA8B3',
      padding: 10,
      height: "105px",
      width: "192px",
      boxShadow: "0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24)",
      fontWeight: 600,
      borderRadius: "65px",
      backgroundColor: theme === 'light' ? "rgb(123 97 255 / 16%)" : "#99f5ff4f",
      border: theme === 'light'? "1px solid rgba(123, 97, 255, 1)" : "1px solid #99F5FF" ,
      color: theme === 'light' ?"rgba(123, 97, 255, 1)" : "#99F5FF",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "17px",
    };
  } else {
    return {
      height: "115px",
      width: "115px",
      borderRadius: "6px",
      border: theme === 'light'? "1px solid #2E83FF" : "1px solid rgba(123, 97, 255, 1)",
      backgroundColor: theme === 'light' ? "rgba(46, 131, 255, 0.2)" : "rgb(123 97 255 / 16%)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "17px",
      color: theme === 'light' ? '#2E83FF' : "rgba(123, 97, 255, 1)",
    };
  }

};

const CustomNode = ({ data }) => {
  const { uiTheme } = useFlowChartState();
  if (data.label === "MULTIPLY" || data.label === "ADD") {
    return (
      <div style={{ position: "relative" }}>
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
        {data.label === "MULTIPLY" && (
          <MultiplySvg
            style={{
              position: 'absolute',
              top: '41px',
              left: '29px',
              height: '19px',
              width: '18px',
            }}
          />
        )}
        {data.label === "ADD" && (
          <AddSvg
          style={{
            position: 'absolute',
            top: '41px',
            left: '29px',
            height: '19px',
            width: '18px',
          }}
          />
        )}
      </div>
    );
  }
  if (data.label === "HISTOGRAM" || data.label === "SCATTER") {
    return (
      <div
        style={{
          position: "relative",
          // height:119,
          width:'fit-content'
        }}
      >
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
        {data.label === "SCATTER" && (
          <>
            <ScatterTitle
              theme={uiTheme}
              style={{
                position: "absolute",
                top: 21,
                left: "50%",
                transform: "translateX(-50%)",
              }}
            />
            <ScatterBubbles
              theme={uiTheme}
              style={{
                position: "absolute",
                bottom: 5,
                left: "50%",
                transform: "translateX(-50%)",
                height:105
              }}
            />
          </>
        )}
        {data.label === "HISTOGRAM" && (
          <>
            <HistoTitle
              theme={uiTheme}
              style={{
                position: "absolute",
                top: 20,
                left: "50%",
                transform: "translateX(-50%)",
              }}
            />
            <HistoLabels
              theme={uiTheme}
              style={{
                position: "absolute",
                bottom: '-4px',
                left: 79,
                height:106,
                width:109
              }}
            />
          </>
        )}
        <BGTemplate 
        // style={{height:120,width:188}}
         theme={uiTheme} />
      </div>
    );
  }
  return (
    <div style={getNodeStyle(data, uiTheme)}>
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
      <div>{data.label}</div>
    </div>
  );
};

export default CustomNode;
