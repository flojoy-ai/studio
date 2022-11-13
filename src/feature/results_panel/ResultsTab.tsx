import { memo, useMemo } from "react";
import ReactFlow, {
  ConnectionLineType,
  EdgeTypesType,
  NodeTypesType,
  OnLoadFunc,
  OnLoadParams,
  ReactFlowProvider,
} from "react-flow-renderer";
import { useWindowSize } from "react-use";
import CustomEdge from "../flow_chart_panel/CustomEdge";
import CustomResultNode from "./CustomResultNode";
import { useResultsTabState } from "./ResultsTabState";
import { useResultsTabEffects } from "./ResultsTabEffects";

import "./Results.css";

const edgeTypes: EdgeTypesType = { default: CustomEdge as any };
const nodeTypes: NodeTypesType = { default: CustomResultNode as any };

const ResultsTab = ({ results }) => {
  const {
    resultElements,
    setResultElements,
  } = useResultsTabState();

  const { width: windowWidth } = useWindowSize();
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

  const ReactFlowProviderAny: any = ReactFlowProvider;

  const nodeResults = useMemo(
    () => ("io" in results ? JSON.parse(results.io).reverse() : []),
    [results]
  );

  useResultsTabEffects(nodeResults);

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
