import { Handle, Position } from "react-flow-renderer";
import { useFlowChartState } from "../../hooks/useFlowChartState";
import Plot from "react-plotly.js";
import styledPlotLayout from "./../defaultPlotLayout";

const CustomResultNode = ({ data }) => {
  const { uiTheme } = useFlowChartState();
  const styledLayout = styledPlotLayout(uiTheme);
  return (
    <div style={{ position: "relative" }}>
      {(data.func === "MULTIPLY" || data.func === "ADD") && (
        <>
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
        </>
      )}
      {data.type === "VISOR" && (
        <>
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
        </>
      )}
      {!(data.func === "MULTIPLY" || data.func === "ADD") &&
        data.type !== "VISOR" && (
          <>
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
          </>
        )}

      {data?.resultData !== null ? (
        <Plot
          data={
            "data" in data.resultData
              ? data.resultData.data
              : [{ x: data.resultData["x0"], y: data.resultData["y0"] }]
          }
          layout={
            "layout" in data.resultData
              ? Object.assign({}, data.resultData.layout, styledLayout)
              : Object.assign({}, { title: `${data.func}` }, styledLayout)
          }
          useResizeHandler
          style={{
            height: 235,
            width: 230,
          }}
        />
      ) : (
        <p> `NO Result`</p>
      )}
    </div>
  );
};

export default CustomResultNode;
