import { memo, useMemo, useEffect } from "react";
import ReactFlow, {
  ConnectionLineType,
  EdgeTypesType,
  NodeTypesType,
  OnLoadFunc,
  OnLoadParams,
  ReactFlowProvider,
} from "react-flow-renderer";
import { useWindowSize } from "react-use";
import CustomEdge from "../flow_chart_panel/views/CustomEdge";
import CustomResultNode from "./views/CustomResultNode";
import { useResultsTabState } from "./ResultsTabState";
import { useFlowChartState } from "../../hooks/useFlowChartState";

import "./style/Results.css";

const edgeTypes: EdgeTypesType = { default: CustomEdge as any };
const nodeTypes: NodeTypesType = { default: CustomResultNode as any };

const ResultsTab = ({ results }) => {
  const { resultElements, setResultElements } = useResultsTabState();
  const { elements } = useFlowChartState();

  const { width: windowWidth } = useWindowSize();
  const onLoad: OnLoadFunc = (rfIns: OnLoadParams) => {
    rfIns.fitView();

    const flowSize = 1107;
    const xPosition = windowWidth > flowSize ? (windowWidth - flowSize) / 2 : 0;

    rfIns.setTransform({
      x: xPosition,
      y: 61,
      zoom: 0.7,
    });
  };

  const ReactFlowProviderAny: any = ReactFlowProvider;

  const nodeResults = useMemo(
    () => (results && "io" in results ? results.io : []),
    [results]
  );

  useEffect(() => {
    if (nodeResults && nodeResults.length > 0 && elements.length > 0) {
      setResultElements(
        elements.map((elem: any) => ({
          ...elem,
          position: elem.position, //resultNodePosition[elem?.data?.func],
          data: {
            ...elem.data,
            ...(!("source" in elem) && {
              resultData: nodeResults?.find((result) => result.id === elem.id)
                ?.result,
            }),
          },
        }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeResults, elements]);

  return (
    <ReactFlowProviderAny>
      <div style={{ height: `99vh` }} data-testid="results-flow">
        <ReactFlow
          elements={resultElements}
          edgeTypes={edgeTypes}
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.Step}
          onLoad={onLoad}
        />
      </div>
    </ReactFlowProviderAny>
  );
};

export default memo(ResultsTab);
