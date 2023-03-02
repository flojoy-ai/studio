import { Handle, Position } from "reactflow";
import { useFlowChartState } from "../../../hooks/useFlowChartState";
import styledPlotLayout from "../../common/defaultPlotLayout";
import PlotlyComponent from "../../common/PlotlyComponent";
import { ResultNodeData } from "../types/ResultsType";
import { Buffer } from "buffer";
interface CustomResultNodeProp {
  data: ResultNodeData;
}
const CustomResultNode: React.FC<CustomResultNodeProp> = ({ data }) => {
  const { uiTheme } = useFlowChartState();
  const styledLayout = styledPlotLayout(uiTheme);

  if (
    data?.resultData &&
    data.resultData.type &&
    data.resultData.type === "image" &&
    data.resultData.y !== undefined
  ) {
    const fileType = data.resultData.file_type![0];
    const fileContent = data.resultData.y![0];
    data.resultData.source = convertToDataUrl(fileContent, fileType);
  }

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
        <p> NO Result </p>
      ) : (
        <PlotlyComponent
          id={data.id}
          data={[data.resultData]}
          layout={
            !data.resultData?.layout
              ? Object.assign({}, { title: `${data.func}` }, styledLayout)
              : Object.assign(
                  {},
                  { title: `${data.func}` },
                  data.resultData.layout,
                  styledLayout
                )
          }
          useResizeHandler
          style={{
            height: 190,
            width: 210,
          }}
        />
      )}
    </div>
  );
};

export default CustomResultNode;

function convertToDataUrl(fileContent: any, fileType: string): string {
  let dataUrl = "";
  switch (fileType) {
    case "image":
      dataUrl = "data:image/jpeg;base64," + convertToBase64(fileContent);
      break;
    default:
      break;
  }
  return dataUrl;
}

const convertToBase64 = (content: any) =>
  Buffer.from(content).toString("base64");
