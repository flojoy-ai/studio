import { useMemo } from "react";
import { useWindowSize } from "react-use";
import CustomEdge from "../flow_chart_panel/views/CustomEdge";
import CustomResultNode from "./views/CustomResultNode";
import { useResultsTabState } from "./ResultsTabState";

import "./style/Results.css";
import {
  ConnectionLineType,
  EdgeTypes,
  NodeTypes,
  OnInit,
  ReactFlow,
  ReactFlowProvider,
} from "reactflow";
import { ResultsType } from "./types/ResultsType";
import { useResultsTabEffects } from "./ResultsTabEffects";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
interface ResultsTabProps {
  results: ResultsType;
}
const edgeTypes: EdgeTypes = { default: CustomEdge as any };
const nodeTypes: NodeTypes = { default: CustomResultNode as any };

const ResultsTab = ({ results }: ResultsTabProps) => {
  const { setResultNodes, nodes, resultNodes } = useResultsTabState();
  const { edges } = useFlowChartState();

  const { width: windowWidth } = useWindowSize();
  const onInit: OnInit = (rfIns) => {
    rfIns.fitView();

    const flowSize = 1107;
    const xPosition = windowWidth > flowSize ? (windowWidth - flowSize) / 2 : 0;

    rfIns.setViewport({
      x: xPosition,
      y: 61,
      zoom: 0.7,
    });
  };
  const nodeResults = useMemo(
    () => (results && "io" in results ? results.io! : []),
    [results]
  );

  useResultsTabEffects({ nodeResults, setResultNodes, nodes, resultNodes });

  return (
    <ReactFlowProvider>
      <div style={{ height: `99vh` }} data-testid="results-flow">
        <ReactFlow
          nodes={resultNodes}
          edges={edges}
          edgeTypes={edgeTypes}
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.Step}
          onInit={onInit}
        />
      </div>
    </ReactFlowProvider>
  );
};

export default ResultsTab;