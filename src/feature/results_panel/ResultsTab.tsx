import { memo, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  ConnectionLineType,
  EdgeTypesType,
  NodeTypesType,
  OnLoadFunc,
  OnLoadParams,
  ReactFlowProvider,
} from "react-flow-renderer";
import { useWindowSize } from "react-use";
import { useFlowChartState } from "../../hooks/useFlowChartState";
import CustomEdge from "../flow_chart_panel/CustomEdge";
import CustomResultNode from "./CustomResultNode";
import { nodePosition } from "./NODE_POSITION";

import "./Results.css";

const edgeTypes: EdgeTypesType = { default: CustomEdge as any };
const nodeTypes: NodeTypesType = { default: CustomResultNode as any };

const ResultsTab = ({ results, theme }) => {
  const { width: windowWidth } = useWindowSize();
  const { rfInstance } = useFlowChartState();
  const [resultElements, setResultElements] = useState<any[]>([]);
  const nodeResults = useMemo(
    () => ("io" in results ? JSON.parse(results.io).reverse() : []),
    [results]
  );

  const ReactFlowProviderAny: any = ReactFlowProvider;
  const onLoad: OnLoadFunc = (rfIns: OnLoadParams) => {
    rfIns.fitView();
    const flowSize = 1271;
    const xPosition = windowWidth > flowSize ? (windowWidth - flowSize) / 2 : 0;
    rfIns.setTransform({
      x: xPosition,
      y: 52,
      zoom: 0.7,
    });
  };
  useEffect(() => {
    if (nodeResults && nodeResults.length > 0 && rfInstance) {
      setResultElements(
        rfInstance?.elements.map((elem) => ({
          ...elem,
          position: nodePosition[elem?.data?.func],
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
  }, [nodeResults, rfInstance]);
  return (
    <ReactFlowProviderAny>
      <div style={{ height: `99vh` }} data-testid="results-flow">
        <ReactFlow
          elements={resultElements}
          edgeTypes={edgeTypes}
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.Step}
          onLoad={onLoad}
        ></ReactFlow>
      </div>
    </ReactFlowProviderAny>
  );
};

export default memo(ResultsTab);
