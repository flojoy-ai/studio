import { Handle, Position } from "react-flow-renderer";
import { useFlowChartState } from "../../hooks/useFlowChartState";
import Plot from "react-plotly.js";
import styledPlotLayout from "../../components/defaultPlotLayout";

const CustomResultNode = ({ data }) => {
  const { uiTheme } = useFlowChartState();
  const styledLayout = styledPlotLayout(uiTheme);
  
  return (
    <div style={{ position: "relative" }} data-testid="result-node">
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

      {!data?.resultData ? (
        <p> `NO Result`</p>
      ) : (
        <Plot
          data={
            !data.resultData?.data
              ? [{ x: data.resultData["x"], y: data.resultData["y"] }]
              : data.resultData.data
          }
          layout={
            !data.resultData?.layout
              ? Object.assign({}, { title: `${data.func}` }, styledLayout)
              : Object.assign({}, data.resultData.layout, styledLayout)
          }
          useResizeHandler
          style={{
            height: 235,
            width: 230,
          }}
        />
      )}
    </div>
  );
};

export default CustomResultNode;
